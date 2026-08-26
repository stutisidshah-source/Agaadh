export type ASVStatus = 'known' | 'novel' | 'uncertain' | 'artifact' | 'environmental';

export interface ASVNode {
  id: string;
  x: number;
  y: number;
  cluster: number;
  status: ASVStatus;
  classification: string;
  confidence: number;
  depth: number;
  temperature: number;
  metadata: string;
  connections: number;
}

// Helper to generate a random normal distribution roughly
function randomNormal(mean: number, stdDev: number) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export const generateMockASVs = (count: number = 300): ASVNode[] => {
  const asvs: ASVNode[] = [];
  
  const clusters = [
    { status: 'known', cx: 200, cy: 200, sd: 40, prob: 0.5, name: 'Known Taxa' },
    { status: 'novel', cx: 600, cy: 150, sd: 50, prob: 0.25, name: 'Novel Lineage' },
    { status: 'uncertain', cx: 400, cy: 300, sd: 35, prob: 0.15, name: 'Uncertain' },
    { status: 'artifact', cx: 100, cy: 450, sd: 20, prob: 0.05, name: 'Artifact' },
    { status: 'environmental', cx: 700, cy: 400, sd: 30, prob: 0.05, name: 'Environmental Assoc' },
  ];

  let currentId = 1;
  
  clusters.forEach((c, idx) => {
    const clusterCount = Math.floor(count * c.prob);
    for (let i = 0; i < clusterCount; i++) {
      let conf = 0;
      if (c.status === 'known') conf = randomNormal(95, 3);
      else if (c.status === 'novel') conf = randomNormal(15, 5);
      else if (c.status === 'uncertain') conf = randomNormal(65, 10);
      else if (c.status === 'artifact') conf = randomNormal(99, 0.5);
      else conf = randomNormal(50, 20);
      
      conf = Math.min(100, Math.max(0, conf));
      
      asvs.push({
        id: `ASV_${currentId.toString().padStart(4, '0')}`,
        x: randomNormal(c.cx, c.sd),
        y: randomNormal(c.cy, c.sd),
        cluster: idx,
        status: c.status as ASVStatus,
        classification: `${c.name} Item ${i}`,
        confidence: Number(conf.toFixed(1)),
        depth: Math.floor(randomNormal(6000, 2000)),
        temperature: Number(randomNormal(2.5, 0.5).toFixed(2)),
        metadata: `Sequenced via NovaSeq run ${Math.floor(Math.random() * 10)}`,
        connections: Math.floor(Math.random() * 10) + 1
      });
      currentId++;
    }
  });
  
  return asvs;
};

export const MOCK_ASVS = generateMockASVs(400);

export const getClusterStats = () => {
  const stats: Record<ASVStatus, { count: number; totalConf: number }> = {
    known: { count: 0, totalConf: 0 },
    novel: { count: 0, totalConf: 0 },
    uncertain: { count: 0, totalConf: 0 },
    artifact: { count: 0, totalConf: 0 },
    environmental: { count: 0, totalConf: 0 },
  };
  
  MOCK_ASVS.forEach(asv => {
    stats[asv.status].count++;
    stats[asv.status].totalConf += asv.confidence;
  });
  
  return stats;
};

// Sankey Data (nodes and links)
export const getClassificationFlowData = () => {
  return {
    nodes: [
      { id: 'Total ASVs' },
      { id: 'High Quality' },
      { id: 'Low Quality / Filtered' },
      { id: 'Known Taxa' },
      { id: 'Novel Lineages' },
      { id: 'Uncertain / Pending' },
      { id: 'Artifacts' },
      { id: 'Verified Clades' },
      { id: 'Deep Database Storage' }
    ],
    links: [
      { source: 0, target: 1, value: 380 },
      { source: 0, target: 2, value: 20 },
      { source: 1, target: 3, value: 190 },
      { source: 1, target: 4, value: 100 },
      { source: 1, target: 5, value: 70 },
      { source: 1, target: 6, value: 20 },
      { source: 3, target: 7, value: 185 },
      { source: 4, target: 8, value: 100 },
      { source: 5, target: 8, value: 70 }
    ]
  };
};

export const getNeo4jStats = () => ({
  nodes: 1482,
  relationships: 3215,
  labels: 8,
  properties: 6840,
  clusters: 5
});
