export const landingData = {
  nav: {
    logo: "HEX",
    links: [
      { label: "Training", href: "#" },
      { label: "Intel", href: "#" },
      { label: "Terminal", href: "#", active: true },
      { label: "Simulations", href: "#" },
    ],
    actions: [
      { label: "LOGIN", type: "secondary" },
      { label: "ENROLL", type: "primary" },
    ],
  },
  hero: {
    status: "System Ready",
    title: "Select Operational Environment.",
    description: "Choose between threat intelligence operations or tactical training academy. Secure connection established. Awaiting command input.",
    ascii: `  /\\   /\\
 //\\\\_//\\\\  [LINK ESTABLISHED]
 \\\\_   _//  SYS_CHECK: OK
   || ||    NET_ROUTE: SECURE
   ||_||    ENC_LEVEL: MAX
  /_____\\
  \\___//
  //   \\\\   HEX_CORE_v4.2.1
 //     \\\\`
  },
  environments: [
    {
      id: "ENV_01",
      title: "Cyber Threat Intel",
      description: "Access live telemetry feeds, conduct active penetration testing, and analyze real-time threat vectors in an unconstrained environment. For cleared personnel only.",
      icon: "radar",
      terminal: [
        { type: "command", text: "> init_scan --target \"global_nodes\"" },
        { type: "success", text: "[+] Scanning 4,201 nodes..." },
        { type: "info", text: "[+] Node A7x: Vulnerability detected (CVE-2023-XXXX)" },
        { type: "info", text: "[+] Node B2y: Connection refused" },
      ],
      buttonText: "Enter Dashboard",
      primary: true,
    },
    {
      id: "ENV_02",
      title: "Hex Academy",
      description: "Structured tactical training grounds. Progress through simulated exploit scenarios, learn modern defense mechanisms, and earn operational clearance.",
      icon: "school",
      progress: {
        label: "OPERATOR RANK",
        rank: "LEVEL 1",
        percent: 0,
        xp: "0",
        nextXp: "100",
      },
      buttonText: "Enter Academy",
      primary: false,
    },
  ],
  footer: {
    copyright: "©2024 HEX_SYSTEM_CORE",
    stats: [
      { label: "STATUS", value: "OPERATIONAL" },
      { label: "LATENCY", value: "22MS" },
      { label: "ENCRYPTION", value: "ACTIVE" },
      { label: "VERSION", value: "v4.0.2-BETA" },
    ],
  },
};
