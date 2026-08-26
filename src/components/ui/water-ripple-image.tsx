'use client';

import { useEffect, useRef, useState } from 'react';

type Params = {
  blueish: number;
  scale: number;
  illumination: number;
  surfaceDistortion: number;
  waterDistortion: number;
  /** default image to load initially */
  src: string;
};

export type WaterRippleImageProps = Partial<Params> & {
  /** Extra class on the canvas wrapper */
  className?: string;
};

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;
uniform vec2 u_mouse;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  
  // Calculate distance from current pixel to mouse position
  float dist = distance(uv, u_mouse);
  // Create an expanding ripple effect originating from the mouse
  float mouse_ripple = sin(dist * 40. - t * 15.) * exp(-dist * 4.);
  
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2) + (mouse_ripple * 0.1);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    // Canvas is wider than image. Fit to width, crop height.
    img_uv.y = img_uv.y * (u_img_ratio / u_ratio);
  } else {
    // Canvas is taller than image. Fit to height, crop width.
    img_uv.x = img_uv.x * (u_ratio / u_img_ratio);
  }
  // Removed scale_factor to pan the background to the entire screen perfectly
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  // Removed edge alpha fading to prevent whitespace-like borders
  
  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || 'unknown'}`);
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || 'unknown'}`);
  }
  return prog;
}

export default function WaterRippleImage({
  blueish = 0.6,
  scale = 7,
  illumination = 0.15,
  surfaceDistortion = 0.07,
  waterDistortion = 0.03,
  src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  className = '',
}: WaterRippleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const texRef = useRef<WebGLTexture | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const animRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // parameters state (mirrors your original `params`)
  const [params] = useState<Params>({
    blueish,
    scale,
    illumination,
    surfaceDistortion,
    waterDistortion,
    src,
  });

  // devicePixelRatio cap: limit to 1 on mobile to save GPU, otherwise max 2
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2) : 1;

  const updateUniforms = (gl: WebGLRenderingContext) => {
    const u = uniformsRef.current;
    gl.uniform1f(u['u_blueish'], params.blueish);
    gl.uniform1f(u['u_scale'], params.scale);
    gl.uniform1f(u['u_illumination'], params.illumination);
    gl.uniform1f(u['u_surface_distortion'], params.surfaceDistortion);
    gl.uniform1f(u['u_water_distortion'], params.waterDistortion);
  };

  const setTextureFromImage = (gl: WebGLRenderingContext, source: HTMLImageElement | HTMLVideoElement) => {
    if (texRef.current) gl.deleteTexture(texRef.current);
    const texture = gl.createTexture()!;
    texRef.current = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

    const u = uniformsRef.current;
    gl.uniform1i(u['u_image_texture'], 0);

    // set ratios
    const isVideo = source instanceof HTMLVideoElement;
    const mediaWidth = isVideo ? (source as HTMLVideoElement).videoWidth : (source as HTMLImageElement).naturalWidth;
    const mediaHeight = isVideo ? (source as HTMLVideoElement).videoHeight : (source as HTMLImageElement).naturalHeight;
    const imgRatio = mediaWidth / mediaHeight;
    const canvas = canvasRef.current!;
    gl.uniform1f(u['u_ratio'], canvas.width / canvas.height);
    gl.uniform1f(u['u_img_ratio'], imgRatio);
  };

  const loadImage = (srcUrl: string, gl: WebGLRenderingContext) =>
    new Promise<void>((resolve, reject) => {
      // Clean up previous video if it exists
      if (vidRef.current) {
        vidRef.current.pause();
        vidRef.current.removeAttribute('src');
        vidRef.current.load();
        vidRef.current = null;
      }
      imgRef.current = null;

      if (srcUrl.match(/\.(mp4|webm|ogg)$/i)) {
        const vid = document.createElement('video');
        vid.crossOrigin = 'anonymous';
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.src = srcUrl;
        
        vid.oncanplay = () => {
          vidRef.current = vid;
          vid.play().catch(console.error);
          setTextureFromImage(gl, vid);
          resolve();
        };
        vid.onerror = (e) => {
          console.error('Video load error', e);
          import('./Toast').then(({ toast }) => toast('Background video failed to load.', 'error'));
          reject(e);
        };
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imgRef.current = img;
          setTextureFromImage(gl, img);
          resolve();
        };
        img.onerror = (e) => {
          console.error('Image load error', e);
          import('./Toast').then(({ toast }) => toast('Background image failed to load.', 'error'));
          reject(e);
        };
        img.src = srcUrl;
      }
    });

  const resize = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;

    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    const u = uniformsRef.current;
    gl.uniform1f(u['u_ratio'], canvas.width / canvas.height);

    // if we have media, ensure u_img_ratio is set
    if (imgRef.current) {
      const imgRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      gl.uniform1f(u['u_img_ratio'], imgRatio);
    } else if (vidRef.current) {
      const vidRatio = vidRef.current.videoWidth / vidRef.current.videoHeight;
      gl.uniform1f(u['u_img_ratio'], vidRatio);
    }
  };

  // init GL once
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // program
    const program = createProgram(gl, VERT, FRAG);
    programRef.current = program;
    gl.useProgram(program);

    // uniforms map
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniformsRef.current[info.name] = gl.getUniformLocation(program, info.name);
    }

    // buffer for a_position
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // initial uniforms
    updateUniforms(gl);

    // load default image
    loadImage(params.src, gl).catch((e) => console.error(e));

    // first resize + listener
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    // mouse listener
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight)
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    // render loop
    const render = () => {
      const u = uniformsRef.current;
      if (u['u_time']) {
        gl.uniform1f(u['u_time'], performance.now());
      }
      if (u['u_mouse']) {
        gl.uniform2f(u['u_mouse'], mouseRef.current.x, mouseRef.current.y);
      }
      
      // Update texture with new video frame
      if (vidRef.current && vidRef.current.readyState >= 2 && texRef.current) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texRef.current);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vidRef.current);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (texRef.current) gl.deleteTexture(texRef.current);
      gl.useProgram(null);
      if (programRef.current) gl.deleteProgram(programRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when params change → push to uniforms (exactly like updateUniforms)
  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;
    updateUniforms(gl);
  }, [params.blueish, params.scale, params.illumination, params.surfaceDistortion, params.waterDistortion]);

  // handle file selection → load into texture
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const onChange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const gl = glRef.current;
        if (!gl) return;
        loadImage(dataUrl, gl).catch((err) => console.error(err));
      };
      reader.readAsDataURL(file);
    };

    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={`relative w-screen h-screen ${className}`}>
      {/* hidden file input (exact behavior) */}
      <input ref={inputRef} id="image-selector-input" type="file" className="hidden" />

      {/* full-screen canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen"
        style={{ top: 0, left: 0 }}
      />
    </div>
  );
}

export { WaterRippleImage };
