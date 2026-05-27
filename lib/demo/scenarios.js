// Exact demo scenarios from system_prompt.md — pre-loaded for live demos.
// Never modify these; they are the validated test inputs.

export const DEMO_SCENARIOS = [
  {
    id: 'modbus-plc',
    label: 'Modbus PLC Anomaly',
    tag: 'Scenario 1',
    facilityType: 'energy',
    alertText: `Modbus Function Code 06 (Write Single Register) detected on PLC-07 at 02:14 AM from source IP 192.168.10.44. This IP is outside the approved engineering workstation range. Target register address: 40011 (motor speed setpoint). Value written: 3400 RPM. Previous safe operating value: 1200 RPM. Activity occurred outside scheduled maintenance window. No work order found for this asset at this time.`,
  },
  {
    id: 'historian-exfil',
    label: 'Historian Exfiltration',
    tag: 'Scenario 2',
    facilityType: 'energy',
    alertText: `OPC-UA bulk read request from workstation WS-22 to Historian server HIS-01. Request accessed 847 process tags in 4.2 seconds. Normal baseline read rate: 12 tags per minute. WS-22 is assigned to the maintenance team — no scheduled activity today. Tags accessed include turbine speed, pressure setpoints, valve positions, and flow rates across Units 1-4.`,
  },
  {
    id: 'hmi-brute-force',
    label: 'HMI Brute Force',
    tag: 'Scenario 3',
    facilityType: 'energy',
    alertText: `14 consecutive failed login attempts on HMI-03 (Turbine Control Interface) between 03:00–03:08 AM. Source IP: 10.0.5.91 — not in asset inventory. HMI-03 controls the Unit 2 steam turbine governor including speed setpoint and emergency trip functions. All attempts used different username formats suggesting credential enumeration.`,
  },
];
