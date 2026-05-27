// OT protocol anomaly patterns for grounded analysis
export const PROTOCOLS_KNOWLEDGE = `OT PROTOCOL ANOMALY PATTERNS:
Use these to ground protocol analysis in technical fact.

MODBUS TCP/RTU:
  Normal: Function codes FC01-FC04 (reads), FC05-FC06 (single writes) during maintenance windows
  Anomalous: FC06/FC16 writes from non-engineering IPs, values outside safe operating ranges,
             writes outside scheduled maintenance windows, register addresses for safety-critical
             setpoints (speed, pressure, temperature limits)
  Key risk: No authentication — any device that can reach the PLC can write to it

DNP3:
  Normal: Polling from master to outstation at configured intervals
  Anomalous: Unsolicited messages, DNP3 application layer spoofing, SELECT-OPERATE pairs
             from unknown masters, writes to control objects without prior SELECT
  Key risk: Widely used in electric utilities and water — limited integrity protection in older deployments

OPC-UA:
  Normal: Tag reads at baseline rate (typically 10-50 tags/minute for process monitoring)
  Anomalous: Bulk reads >200 tags/minute (historian exfiltration pattern), sessions from
             unexpected endpoints, reads of all available tags (discovery/enumeration behavior)
  Key risk: Rich data access — process values, asset inventory, network topology all accessible

IEC 61850 (GOOSE/MMS):
  Normal: Periodic GOOSE heartbeats, MMS reads for monitoring
  Anomalous: GOOSE replay attacks, fabricated GOOSE trip commands, MMS writes to control objects,
             loss of GOOSE heartbeat (network attack indicator)
  Key risk: Direct path to protection relay operation and substation switching

EtherNet/IP (CIP):
  Normal: Implicit I/O messaging at configured RPI, explicit messaging for configuration
  Anomalous: Unexpected ForwardOpen requests, CIP writes to output assemblies from unknown originators
  Key risk: Direct to PLC I/O — can force digital/analog outputs regardless of ladder logic`;
