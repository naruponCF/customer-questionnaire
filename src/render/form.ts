export function renderForm(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Customer Information Questionnaire</title>
  <style>
    :root {
      --cf-orange: #F38020;
      --cf-dark: #1e1e1e;
      --cf-gray: #f5f5f5;
      --cf-border: #ddd;
      --cf-white: #fff;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--cf-gray);
      color: var(--cf-dark);
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(135deg, #F38020, #F6821F);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
    }
    .header img { height: 40px; margin-bottom: 0.5rem; }
    .header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .header p { font-size: 0.9rem; opacity: 0.9; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
    .section {
      background: var(--cf-white);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .section h2 {
      font-size: 1.25rem;
      color: var(--cf-orange);
      border-bottom: 2px solid var(--cf-orange);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .section h3 {
      font-size: 1rem;
      color: #333;
      margin: 1.5rem 0 0.75rem;
      padding-left: 0.5rem;
      border-left: 3px solid var(--cf-orange);
    }
    .field { margin-bottom: 0.75rem; }
    .field label {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }
    .field label .req { color: #e74c3c; }
    .field input, .field select, .field textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--cf-border);
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none;
      border-color: var(--cf-orange);
      box-shadow: 0 0 0 2px rgba(243,128,32,0.15);
    }
    .field textarea { resize: vertical; min-height: 60px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 600px) { .field-row { grid-template-columns: 1fr; } }
    .submit-btn {
      display: block;
      width: 100%;
      padding: 1rem;
      background: var(--cf-orange);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .submit-btn:hover { background: #e06d1a; }
    .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: none;
    }
    .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .footer { text-align: center; padding: 2rem; color: #999; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>☁️ Cloudflare Customer Information Questionnaire</h1>
    <p>Please fill in the information below so we can generate an accurate commercial quote for you.</p>
  </div>

  <div class="container">
    <div id="alert" class="alert"></div>

    <!-- Section 0: General -->
    <div class="section">
      <h2>Section 0: General Company Information</h2>
      <div class="field-row">
        <div class="field">
          <label>Company Name <span class="req">*</span></label>
          <input type="text" name="general.companyName" required>
        </div>
        <div class="field">
          <label>Country / Region <span class="req">*</span></label>
          <input type="text" name="general.country" required>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Industry</label>
          <input type="text" name="general.industry">
        </div>
        <div class="field">
          <label>Number of Employees</label>
          <input type="text" name="general.employees">
        </div>
      </div>
      <div class="field">
        <label>Website Domain(s) to be Protected <span class="req">*</span></label>
        <input type="text" name="general.websiteDomains" required placeholder="example.com, app.example.com">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current Cloudflare Plan</label>
          <select name="general.currentPlan">
            <option value="">— Select —</option>
            <option>Free</option><option>Pro</option><option>Business</option><option>Enterprise</option>
          </select>
        </div>
        <div class="field">
          <label>Current CDN / Security Vendor(s)</label>
          <input type="text" name="general.currentVendor">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Primary Technical Contact</label>
          <input type="text" name="general.techContact" placeholder="name and email">
        </div>
        <div class="field">
          <label>Billing Contact</label>
          <input type="text" name="general.billingContact" placeholder="name and email">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Contract Term Preference <span class="req">*</span></label>
          <select name="general.contractTerm" required>
            <option value="">— Select —</option>
            <option>Annual</option><option>Multi-year (2 years)</option><option>Multi-year (3 years)</option>
          </select>
        </div>
        <div class="field">
          <label>Target Start Date</label>
          <input type="date" name="general.targetStartDate">
        </div>
      </div>
      <div class="field">
        <label>Regulatory Compliance Requirements</label>
        <input type="text" name="general.complianceRequirements" placeholder="PCI DSS, HIPAA, SOC 2, ISO 27001, FedRAMP, etc.">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Data Residency Requirements</label>
          <input type="text" name="general.dataResidency" placeholder="specific country/region">
        </div>
        <div class="field">
          <label>Existing Cloudflare Account ID</label>
          <input type="text" name="general.existingAccountId">
        </div>
      </div>
    </div>

    <!-- Section 1: Application Services -->
    <div class="section">
      <h2>Section 1: Application Services</h2>
      <p style="font-size:0.85rem;color:#666;margin-bottom:1rem;">CDN, WAF, DDoS Protection, Bot Management, API Gateway, Page Shield, Argo, Load Balancing, Images, Stream, Zaraz, DNS, Spectrum, China Network</p>

      <h3>1.1 Traffic &amp; Performance</h3>
      <div class="field-row">
        <div class="field">
          <label>Average Monthly HTTP/HTTPS Requests <span class="req">*</span></label>
          <input type="text" name="appServices.avgMonthlyRequests" required placeholder="e.g., 500M, 2B, 10B">
        </div>
        <div class="field">
          <label>Peak Monthly Requests</label>
          <input type="text" name="appServices.peakMonthlyRequests">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Average Monthly Bandwidth (egress)</label>
          <input type="text" name="appServices.avgMonthlyBandwidth">
        </div>
        <div class="field">
          <label>Number of Hostnames / Zones</label>
          <input type="text" name="appServices.numHostnames">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Origin Infrastructure</label>
          <input type="text" name="appServices.originInfra" placeholder="AWS / GCP / Azure / on-prem / hybrid">
        </div>
        <div class="field">
          <label>Current CDN</label>
          <input type="text" name="appServices.currentCDN">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current Cache Hit Ratio</label>
          <input type="text" name="appServices.cacheHitRatio">
        </div>
        <div class="field">
          <label>Peak-to-Average Traffic Ratio</label>
          <input type="text" name="appServices.peakToAvgRatio">
        </div>
      </div>
      <div class="field">
        <label>Latency-Sensitive Workloads / SLA Requirements</label>
        <input type="text" name="appServices.latencySLA">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Argo Smart Routing?</label>
          <select name="appServices.argoInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Tiered Cache / Cache Reserve?</label>
          <select name="appServices.tieredCacheInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>

      <h3>1.2 Application Security</h3>
      <div class="field-row">
        <div class="field">
          <label>Current WAF Solution <span class="req">*</span></label>
          <input type="text" name="appServices.currentWAF" required placeholder="Cloudflare, Akamai, Imperva, AWS WAF, F5, none">
        </div>
        <div class="field">
          <label>Number of Web Applications to Protect</label>
          <input type="text" name="appServices.numWebApps">
        </div>
      </div>
      <div class="field">
        <label>Key Security Concerns</label>
        <textarea name="appServices.securityConcerns" placeholder="OWASP Top 10, zero-day vulnerabilities, data leakage, etc."></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Bot Management?</label>
          <select name="appServices.botManagementInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Number of APIs to Protect</label>
          <input type="text" name="appServices.numAPIs">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in API Gateway?</label>
          <select name="appServices.apiGatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Page Shield?</label>
          <select name="appServices.pageShieldInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>WAF Compliance Drivers</label>
          <input type="text" name="appServices.wafComplianceDrivers" placeholder="PCI DSS 6.6, OWASP, etc.">
        </div>
        <div class="field">
          <label>Custom Rules / Managed Rulesets Needed?</label>
          <input type="text" name="appServices.customRulesNeeded">
        </div>
      </div>

      <h3>1.3 DDoS Protection</h3>
      <div class="field-row">
        <div class="field">
          <label>Experienced DDoS Attacks? <span class="req">*</span></label>
          <input type="text" name="appServices.ddosExperienced" required placeholder="frequency and scale">
        </div>
        <div class="field">
          <label>Current DDoS Mitigation Solution</label>
          <input type="text" name="appServices.currentDDoS">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Peak Attack Size Observed</label>
          <input type="text" name="appServices.peakAttackSize" placeholder="Gbps / Mpps">
        </div>
        <div class="field">
          <label>DDoS Layers (L3/L4, L7, or both?)</label>
          <input type="text" name="appServices.ddosLayers">
        </div>
      </div>
      <div class="field">
        <label>Interest in Always-on vs. On-demand?</label>
        <input type="text" name="appServices.ddosMode">
      </div>

      <h3>1.4 DNS</h3>
      <div class="field-row">
        <div class="field">
          <label>Current Authoritative DNS Provider</label>
          <input type="text" name="appServices.dnsProvider">
        </div>
        <div class="field">
          <label>Number of DNS Records / Zones</label>
          <input type="text" name="appServices.dnsRecords">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Monthly DNS Queries</label>
          <input type="text" name="appServices.dnsQueries">
        </div>
        <div class="field">
          <label>Interest in DNS Firewall?</label>
          <select name="appServices.dnsFirewallInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Interest in Secondary DNS?</label>
        <select name="appServices.secondaryDnsInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
      </div>

      <h3>1.5 Media &amp; Additional Services</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in Cloudflare Images?</label>
          <input type="text" name="appServices.imagesInterest" placeholder="monthly transformations">
        </div>
        <div class="field">
          <label>Interest in Cloudflare Stream?</label>
          <input type="text" name="appServices.streamInterest" placeholder="monthly video minutes">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Zaraz?</label>
          <select name="appServices.zarazInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Spectrum?</label>
          <input type="text" name="appServices.spectrumInterest" placeholder="protocols (TCP/UDP)">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in China Network?</label>
          <select name="appServices.chinaNetworkInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Load Balancing?</label>
          <input type="text" name="appServices.loadBalancingInterest" placeholder="number of origin pools">
        </div>
      </div>
    </div>

    <!-- Section 2: Zero Trust -->
    <div class="section">
      <h2>Section 2: Zero Trust</h2>
      <p style="font-size:0.85rem;color:#666;margin-bottom:1rem;">Access (ZTNA), Gateway (SWG), CASB, DLP, Browser Isolation, Email Security, Device Posture, WARP, Tunnel, Magic Transit, Magic WAN, Magic Firewall, CNI</p>

      <h3>2.1 Identity &amp; Access (ZTNA)</h3>
      <div class="field-row">
        <div class="field">
          <label>Number of Users / Seats <span class="req">*</span></label>
          <input type="text" name="zeroTrust.numUsers" required>
        </div>
        <div class="field">
          <label>Identity Provider <span class="req">*</span></label>
          <input type="text" name="zeroTrust.identityProvider" required placeholder="Okta, Entra ID, Google Workspace, JumpCloud, other">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of Internal Applications</label>
          <input type="text" name="zeroTrust.numInternalApps">
        </div>
        <div class="field">
          <label>Interest in Clientless Access?</label>
          <select name="zeroTrust.clientlessAccessInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current Remote Access Solution</label>
          <input type="text" name="zeroTrust.currentRemoteAccess" placeholder="VPN, Zscaler ZPA, Palo Alto Prisma, etc.">
        </div>
        <div class="field">
          <label>Service Tokens Needed?</label>
          <input type="text" name="zeroTrust.serviceTokensNeeded">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Device Posture?</label>
          <select name="zeroTrust.devicePostureInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Endpoint Management Tool</label>
          <input type="text" name="zeroTrust.endpointMgmtTool" placeholder="Jamf, Intune, etc.">
        </div>
      </div>

      <h3>2.2 Secure Web Gateway, CASB &amp; DLP</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in Gateway (SWG)?</label>
          <select name="zeroTrust.gatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Gateway Users (if yes)</label>
          <input type="text" name="zeroTrust.gatewayUsers">
        </div>
      </div>
      <div class="field">
        <label>Current SWG Solution</label>
        <input type="text" name="zeroTrust.currentSWG" placeholder="Zscaler ZIA, Netskope, Palo Alto, Symantec, etc.">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in CASB?</label>
          <select name="zeroTrust.casbInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>CASB SaaS Apps</label>
          <input type="text" name="zeroTrust.casbApps" placeholder="M365, Google Workspace, Slack, etc.">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in DLP?</label>
          <select name="zeroTrust.dlpInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>DLP Data Types</label>
          <input type="text" name="zeroTrust.dlpDataTypes">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>HTTPS Inspection Required?</label>
          <select name="zeroTrust.httpsInspection"><option value="">— Select —</option><option>Yes</option><option>No</option></select>
        </div>
        <div class="field">
          <label>Interest in Browser Isolation?</label>
          <select name="zeroTrust.browserIsolationInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Browser Isolation Users (if interested)</label>
        <input type="text" name="zeroTrust.browserIsolationUsers">
      </div>

      <h3>2.3 Email Security</h3>
      <div class="field-row">
        <div class="field">
          <label>Current Email Provider <span class="req">*</span></label>
          <input type="text" name="zeroTrust.emailProvider" required placeholder="M365, Google Workspace, on-prem Exchange">
        </div>
        <div class="field">
          <label>Number of Mailboxes <span class="req">*</span></label>
          <input type="text" name="zeroTrust.numMailboxes" required>
        </div>
      </div>
      <div class="field">
        <label>Current Email Security Solution</label>
        <input type="text" name="zeroTrust.currentEmailSecurity" placeholder="Proofpoint, Abnormal, Mimecast, MS Defender, none">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Area 1 Email Security?</label>
          <select name="zeroTrust.area1Interest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in PhishGuard?</label>
          <select name="zeroTrust.phishGuardInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Daily Email Volume</label>
        <input type="text" name="zeroTrust.dailyEmailVolume">
      </div>

      <h3>2.4 Network Connectivity</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in Cloudflare Tunnel?</label>
          <select name="zeroTrust.tunnelInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Magic Transit?</label>
          <select name="zeroTrust.magicTransitInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Magic WAN?</label>
          <select name="zeroTrust.magicWanInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Magic Firewall?</label>
          <select name="zeroTrust.magicFirewallInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Cloudflare Network Interconnect?</label>
          <select name="zeroTrust.cniInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Number of Branch Sites / Data Centres</label>
          <input type="text" name="zeroTrust.numBranchSites">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current WAN / SD-WAN Vendor</label>
          <input type="text" name="zeroTrust.currentWAN">
        </div>
        <div class="field">
          <label>BGP ASN (if Magic Transit/WAN)</label>
          <input type="text" name="zeroTrust.bgpAsn">
        </div>
      </div>
      <div class="field">
        <label>IP Ranges / CIDR Blocks to Advertise or Protect</label>
        <textarea name="zeroTrust.ipRanges" placeholder="e.g., 203.0.113.0/24, 198.51.100.0/24"></textarea>
      </div>
    </div>

    <!-- Section 3: Developer Platform -->
    <div class="section">
      <h2>Section 3: Developer Platform</h2>
      <p style="font-size:0.85rem;color:#666;margin-bottom:1rem;">Workers, Pages, R2, D1, KV, Queues, Durable Objects, Workers AI, Vectorize, Hyperdrive, AI Gateway, Browser Run, AI Search</p>

      <h3>3.1 Compute (Workers &amp; Pages)</h3>
      <div class="field-row">
        <div class="field">
          <label>Estimated Monthly Worker Requests</label>
          <input type="text" name="developer.workerRequests" placeholder="e.g., 10M, 100M, 1B">
        </div>
        <div class="field">
          <label>Average Worker CPU Time / Request (ms)</label>
          <input type="text" name="developer.workerCpuTime">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of Worker Scripts / Projects</label>
          <input type="text" name="developer.numWorkerScripts">
        </div>
        <div class="field">
          <label>Interest in Pages?</label>
          <select name="developer.pagesInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Current Serverless Platform</label>
        <input type="text" name="developer.currentServerless" placeholder="AWS Lambda, Google Cloud Functions, Azure Functions, Vercel, Netlify">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Workers Logs / Logpush?</label>
          <select name="developer.workersLogsInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Workers Trace Events?</label>
          <select name="developer.traceEventsInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>

      <h3>3.2 Storage &amp; Data</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in R2?</label>
          <select name="developer.r2Interest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>R2 Estimated Storage (TB)</label>
          <input type="text" name="developer.r2Storage">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>R2 Class A Operations / month</label>
          <input type="text" name="developer.r2ClassAOps">
        </div>
        <div class="field">
          <label>R2 Class B Operations / month</label>
          <input type="text" name="developer.r2ClassBOps">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in D1?</label>
          <select name="developer.d1Interest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>D1 Number of Databases</label>
          <input type="text" name="developer.d1NumDatabases">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in KV?</label>
          <select name="developer.kvInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>KV Estimated Read/Write Volume</label>
          <input type="text" name="developer.kvVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Queues?</label>
          <select name="developer.queuesInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Queues Estimated Messages/month</label>
          <input type="text" name="developer.queuesVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Durable Objects?</label>
          <select name="developer.durableObjectsInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>DO Estimated Objects / Requests</label>
          <input type="text" name="developer.doVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Hyperdrive?</label>
          <select name="developer.hyperdriveInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Hyperdrive Database</label>
          <input type="text" name="developer.hyperdriveDb" placeholder="Postgres, etc.">
        </div>
      </div>

      <h3>3.3 AI &amp; Intelligence</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in Workers AI?</label>
          <select name="developer.workersAiInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>AI Estimated Monthly Inference Requests</label>
          <input type="text" name="developer.aiInferenceRequests">
        </div>
      </div>
      <div class="field">
        <label>AI Model Types</label>
        <input type="text" name="developer.aiModelTypes" placeholder="LLM text generation, image classification, speech-to-text, embeddings">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Vectorize?</label>
          <select name="developer.vectorizeInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Vectorize Estimated Vectors</label>
          <input type="text" name="developer.vectorizeVectors">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Vectorize Dimensions</label>
          <input type="text" name="developer.vectorizeDimensions">
        </div>
        <div class="field">
          <label>Interest in AI Gateway?</label>
          <select name="developer.aiGatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Browser Run?</label>
          <select name="developer.browserRunInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Browser Run Estimated Sessions/month</label>
          <input type="text" name="developer.browserRunSessions">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in AI Search?</label>
          <select name="developer.aiSearchInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Current AI / ML Infrastructure</label>
          <input type="text" name="developer.currentAiInfra" placeholder="AWS Bedrock, OpenAI API, Azure OpenAI, self-hosted GPUs">
        </div>
      </div>
    </div>

    <!-- Section 4: Additional -->
    <div class="section">
      <h2>Section 4: Additional Information</h2>
      <div class="field">
        <label>Other Products or Features of Interest</label>
        <textarea name="additional.otherProducts"></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Expected Budget Range</label>
          <input type="text" name="additional.budgetRange">
        </div>
        <div class="field">
          <label>Deployment Timeline / Deadline</label>
          <input type="text" name="additional.timeline">
        </div>
      </div>
      <div class="field">
        <label>Competitive Situation — Evaluating Against Which Vendor?</label>
        <input type="text" name="additional.competitiveVendor">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Professional Services / Onboarding Needed?</label>
          <input type="text" name="additional.psNeeded">
        </div>
        <div class="field">
          <label>Custom Contracting Requirements</label>
          <input type="text" name="additional.customContracting" placeholder="MSA, custom DPA, etc.">
        </div>
      </div>
      <div class="field">
        <label>Additional Comments or Context</label>
        <textarea name="additional.comments"></textarea>
      </div>
    </div>

    <button type="button" class="submit-btn" id="submitBtn" onclick="submitForm()">Submit Questionnaire</button>
  </div>

  <div class="footer">
    Cloudflare Customer Information Questionnaire · Powered by Cloudflare Workers &amp; R2
  </div>

  <script>
    function flattenForm() {
      const form = document.querySelectorAll('input, select, textarea');
      const data = {};
      form.forEach(el => {
        if (el.name) data[el.name] = el.value.trim();
      });
      return data;
    }

    async function submitForm() {
      const btn = document.getElementById('submitBtn');
      const alertEl = document.getElementById('alert');
      btn.disabled = true;
      btn.textContent = 'Submitting...';

      // Validate required fields
      const required = document.querySelectorAll('[required]');
      for (const el of required) {
        if (!el.value.trim()) {
          el.focus();
          el.style.borderColor = '#e74c3c';
          alertEl.className = 'alert error';
          alertEl.textContent = 'Please fill in all required fields (marked with *).';
          alertEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Submit Questionnaire';
          return;
        }
      }

      try {
        const flat = flattenForm();
        // Convert flat to nested
        const nested = {};
        for (const [key, val] of Object.entries(flat)) {
          const parts = key.split('.');
          if (parts.length === 2) {
            if (!nested[parts[0]]) nested[parts[0]] = {};
            nested[parts[0]][parts[1]] = val;
          } else {
            nested[key] = val;
          }
        }

        const resp = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nested)
        });

        if (resp.ok) {
          alertEl.className = 'alert success';
          alertEl.textContent = '✅ Thank you! Your questionnaire has been submitted successfully. We will get back to you with a quote shortly.';
          alertEl.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          btn.textContent = 'Submitted ✓';
          // Reset form
          document.querySelectorAll('input, select, textarea').forEach(el => { if(el.name) el.value = ''; });
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        alertEl.className = 'alert error';
        alertEl.textContent = '❌ Something went wrong. Please try again or contact your Cloudflare account team.';
        alertEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Submit Questionnaire';
      }
    }
  </script>
</body>
</html>`;
}
