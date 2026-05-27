export const DEMO_ASSETS = [
  {
    id: 'gt-01',
    name: 'Gas Turbine GT-01',
    type: 'PLC',
    location: 'Generation Hall',
    ip: '10.10.2.18',
    mac: '00:1A:2B:3C:4D:5E',
    firmware: 'v2.4.1',
    status: 'operational',
    cves: ['CVE-2023-1234', 'CVE-2024-5678'],
    logs: [
      { time: '22:30:12', msg: 'Turbine RPM stabilized at 3600', level: 'ok' },
      { time: '22:25:05', msg: 'Fuel valve calibration complete', level: 'ok' },
    ],
    insight: 'On the surface, GT-01 is running well — RPM at 3600 is nominal for 60Hz sync. However, firmware v2.4.1 carries CVE-2023-1234 and CVE-2024-5678, both exposing the PLC control logic to unauthenticated writes. If exploited, an attacker could bypass recent calibrations and induce a turbine surge or flameout. The digital perimeter is thin. I recommend patching this firmware before the next maintenance window.',
  },
  {
    id: 'transformer-t12',
    name: 'Step-up Transformer T-12',
    type: 'PLC',
    location: 'Substation A',
    ip: '10.10.2.15',
    mac: '00:1A:2B:3C:40:5F',
    firmware: 'v1.0.8',
    status: 'warning',
    cves: ['CVE-2022-9012'],
    logs: [
      { time: '22:32:45', msg: 'Oil temperature rising: 85°C', level: 'warn' },
      { time: '22:30:18', msg: 'Tap changer operation successful', level: 'ok' },
    ],
    insight: 'T-12 is flagging a thermal concern. Oil at 85 degrees Celsius is within operating range but trending upward. CVE-2022-9012 in firmware v1.0.8 allows a remote attacker to issue malformed tap changer commands, which accelerates thermal stress. Combined with the temperature trend, this warrants close monitoring and a firmware patch at the next opportunity.',
  },
  {
    id: 'relay-751',
    name: 'SEL-751 Relay',
    type: 'SCADA',
    location: 'Protection Rack',
    ip: '10.10.2.28',
    mac: '00:1A:2B:3C:40:60',
    firmware: 'v5.2.0',
    status: 'operational',
    cves: [],
    logs: [
      { time: '22:35:06', msg: 'Relay heartbeat detected', level: 'ok' },
      { time: '22:15:30', msg: 'Protection logic updated', level: 'ok' },
    ],
    insight: 'SEL-751 is clean. Firmware v5.2.0 has no known CVEs. The protection logic update at 22:15 is consistent with scheduled maintenance. Heartbeat is steady. No anomalous behavior detected — this asset is your most reliable protection node right now.',
  },
  {
    id: 'gateway-sg',
    name: 'Substation Gateway',
    type: 'Gateway',
    location: 'Main Control',
    ip: '10.10.5.1',
    mac: '00:1A:2B:3C:40:61',
    firmware: 'v3.1.2',
    status: 'critical',
    cves: ['CVE-2024-1337'],
    logs: [
      { time: '22:33:12', msg: 'High packet loss: 15%', level: 'error' },
      { time: '22:31:05', msg: 'Unexpected connection from 10.0.0.45', level: 'warn' },
    ],
    insight: 'This is your highest priority concern right now. Packet loss at 15 percent combined with an unexpected connection from 10.0.0.45 — which is not in your asset inventory — suggests active reconnaissance or early-stage lateral movement. CVE-2024-1337 in firmware v3.1.2 allows unauthenticated command injection through the management interface. I strongly recommend isolating this gateway immediately and investigating the source IP before it reaches your control network.',
  },
];

export const DEMO_THREATS = [
  {
    id: 'threat-1',
    severity: 'critical',
    title: 'Unauthorized DNP3 Breaker Trip Command',
    src: '172.16.4.12',
    tgt: 'Substation_RTU_84',
    time: '22:15:45',
    protocol: 'DNP3',
  },
  {
    id: 'threat-2',
    severity: 'high',
    title: 'Frequency Instability — Potential Load Shedding Attack',
    src: 'Grid_Sync_01',
    tgt: 'Turbine_Controller',
    time: '22:12:18',
    protocol: 'IEC 61850',
  },
  {
    id: 'threat-3',
    severity: 'medium',
    title: 'Abnormal GOOSE Message Traffic Detected',
    src: 'Relay_03',
    tgt: 'Bus_Coupler',
    time: '22:08:05',
    protocol: 'IEC 61850',
  },
];

export function generateTrafficData(points = 42) {
  const data = [];
  let inbound = 260, outbound = 190;
  for (let i = 0; i < points; i++) {
    inbound  += (Math.random() - 0.45) * 55;
    outbound += (Math.random() - 0.48) * 38;
    if (i === 19) inbound = 920;
    if (i === 20) inbound = 780;
    inbound  = Math.max(60,  Math.min(1000, inbound));
    outbound = Math.max(40,  Math.min(500,  outbound));
    data.push({ inbound: Math.round(inbound), outbound: Math.round(outbound) });
  }
  return data;
}
