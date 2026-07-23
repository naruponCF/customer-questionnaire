export function renderForm(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Customer Information Questionnaire</title>
  <style>
    :root { --cf-orange:#F38020; --cf-dark:#1e1e1e; --cf-gray:#f5f5f5; --cf-border:#ddd; --cf-white:#fff; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:var(--cf-gray); color:var(--cf-dark); line-height:1.6; }
    .header { background:linear-gradient(135deg,#F38020,#F6821F); color:white; padding:2rem 1rem; text-align:center; }
    .header h1 { font-size:1.5rem; margin-bottom:0.25rem; }
    .header p { font-size:0.9rem; opacity:0.9; }
    .notes { max-width:900px; margin:1.5rem auto 0; padding:0 1rem; font-size:0.85rem; color:#666; }
    .container { max-width:900px; margin:0 auto; padding:1rem 1rem 2rem; }
    .section { background:var(--cf-white); border-radius:12px; padding:1.5rem; margin-bottom:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .section h2 { font-size:1.25rem; color:var(--cf-orange); border-bottom:2px solid var(--cf-orange); padding-bottom:0.5rem; margin-bottom:0.5rem; }
    .section .covers { font-size:0.85rem; color:#666; margin-bottom:1rem; }
    .section h3 { font-size:1rem; color:#333; margin:1.5rem 0 0.75rem; padding-left:0.5rem; border-left:3px solid var(--cf-orange); }
    .field { margin-bottom:0.75rem; }
    .field label { display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.25rem; }
    .field label .req { color:#e74c3c; }
    .field input, .field select, .field textarea { width:100%; padding:0.5rem 0.75rem; border:1px solid var(--cf-border); border-radius:6px; font-size:0.9rem; font-family:inherit; }
    .field input:focus, .field select:focus, .field textarea:focus { outline:none; border-color:var(--cf-orange); box-shadow:0 0 0 2px rgba(243,128,32,0.15); }
    .field textarea { resize:vertical; min-height:60px; }
    .field-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    @media (max-width:600px) { .field-row { grid-template-columns:1fr; } }
    .submit-btn { display:block; width:100%; padding:1rem; background:var(--cf-orange); color:white; border:none; border-radius:8px; font-size:1.1rem; font-weight:700; cursor:pointer; transition:background 0.2s; }
    .submit-btn:hover { background:#e06d1a; }
    .submit-btn:disabled { background:#ccc; cursor:not-allowed; }
    .alert { padding:1rem; border-radius:8px; margin-bottom:1rem; display:none; }
    .alert.success { background:#d4edda; color:#155724; border:1px solid #c3e6cb; }
    .alert.error { background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; }
    .footer { text-align:center; padding:2rem; color:#999; font-size:0.8rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>☁️ Cloudflare Customer Information Questionnaire</h1>
    <p>Please fill in the information below so we can generate an accurate commercial quote for you.</p>
  </div>
  <div class="notes">
    <strong>Purpose:</strong> This questionnaire collects the information Cloudflare needs to generate an accurate commercial quote. Please fill in as many fields as possible. Fields marked <span style="color:#e74c3c">*</span> (required) must be completed; all others help us tailor the proposal and pricing to your needs.
  </div>

  <div class="container">
    <div id="alert" class="alert"></div>

    <!-- Section 0: General -->
    <div class="section">
      <h2>Section 0: General Company Information</h2>
      <p class="covers">This section applies to all product areas and helps us scope the overall engagement.</p>
      <div class="field">
        <label>Company name <span class="req">*</span></label>
        <input type="text" name="general.companyName" required>
      </div>
      <div class="field">
        <label>Country / region of operation</label>
        <input type="text" name="general.country">
      </div>
      <div class="field">
        <label>Website domain(s) to be protected</label>
        <input type="text" name="general.websiteDomains" placeholder="example.com, app.example.com">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current Cloudflare plan</label>
          <select name="general.currentPlan"><option value="">— Select —</option><option>No</option><option>Free</option><option>Pro</option><option>Business</option><option>Enterprise</option></select>
        </div>
        <div class="field">
          <label>Current CDN / security vendor(s) if any</label>
          <input type="text" name="general.currentVendor">
        </div>
      </div>
      <div class="field-row">
        <div class="field-row">
          <div class="field">
            <label>Primary contact name <span class="req">*</span></label>
            <input type="text" name="general.techContact" required>
          </div>
          <div class="field">
            <label>Primary contact phone/email <span class="req">*</span></label>
            <input type="text" name="general.techContactEmail" required placeholder="phone or email">
          </div>
        </div>
        <div class="field">
          <label>Billing contact name and email</label>
          <input type="text" name="general.billingContact">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Contract term preference</label>
          <select name="general.contractTerm"><option value="">— Select —</option><option>Annual</option><option>Multi-year (2 years)</option><option>Multi-year (3 years)</option></select>
        </div>
        <div class="field">
          <label>Target start date</label>
          <input type="date" name="general.targetStartDate">
        </div>
      </div>
      <div class="field">
        <label>Regulatory compliance requirements</label>
        <input type="text" name="general.complianceRequirements" placeholder="PCI DSS, HIPAA, SOC 2, ISO 27001, FedRAMP, etc.">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Data residency requirements</label>
          <input type="text" name="general.dataResidency" placeholder="specific country/region">
        </div>
        <div class="field">
          <label>Existing Cloudflare account ID (if already a customer)</label>
          <input type="text" name="general.existingAccountId">
        </div>
      </div>
    </div>

    <!-- Section 1: Application Services -->
    <div class="section">
      <h2>Section 1: Application Services</h2>
      <p class="covers">Covers: CDN, WAF, DDoS Protection, Bot Management, API Gateway, Page Shield, Argo Smart Routing, Load Balancing, Images, Stream, Zaraz, DNS, Spectrum, Cache Reserve, Rulesets, China Network.</p>

      <h3>1.1 Traffic &amp; Performance</h3>
      <div class="field">
        <label>Average monthly HTTP/HTTPS requests</label>
        <input type="text" name="appServices.avgMonthlyRequests" placeholder="e.g., 500M, 2B, 10B">
      </div>
      <div class="field">
        <label>Average monthly bandwidth TB (egress)</label>
        <input type="text" name="appServices.avgMonthlyBandwidthTB">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of hostnames / zones to be onboarded</label>
          <input type="text" name="appServices.numHostnames">
        </div>
        <div class="field">
          <label>Origin infrastructure</label>
          <input type="text" name="appServices.originInfra" placeholder="AWS / GCP / Azure / on-prem / hybrid">
        </div>
      </div>
      <div class="field">
        <label>Are you currently using a CDN? Which one?</label>
        <input type="text" name="appServices.currentCDN">
      </div>
      <div class="field">
        <label>Any latency-sensitive workloads or specific SLA requirements?</label>
        <input type="text" name="appServices.latencySLA">
      </div>

      <h3>1.2 Application Security</h3>
      <div class="field">
        <label>Current WAF solution</label>
        <input type="text" name="appServices.currentWAF" placeholder="Cloudflare, Akamai, Imperva, AWS WAF, F5, none">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of web applications to protect</label>
          <input type="text" name="appServices.numWebApps">
        </div>
        <div class="field">
          <label>Number of APIs to protect</label>
          <input type="text" name="appServices.numAPIs">
        </div>
      </div>
      <div class="field">
        <label>Key security concerns</label>
        <textarea name="appServices.securityConcerns" placeholder="OWASP Top 10, zero-day vulnerabilities, data leakage, etc."></textarea>
      </div>
      <div class="field">
        <label>Interest in Bot Management? What bot problem are you seeing?</label>
        <textarea name="appServices.botManagementInterest"></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in API Gateway?</label>
          <select name="appServices.apiGatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Any compliance drivers for WAF?</label>
          <input type="text" name="appServices.wafComplianceDrivers" placeholder="PCI DSS 6.6, OWASP, etc.">
        </div>
      </div>

      <h3>1.3 DDoS Protection</h3>
      <div class="field">
        <label>Have you experienced DDoS attacks?</label>
        <input type="text" name="appServices.ddosExperienced" placeholder="frequency and scale">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current DDoS mitigation solution</label>
          <input type="text" name="appServices.currentDDoS">
        </div>
        <div class="field">
          <label>Peak attack size observed</label>
          <input type="text" name="appServices.peakAttackSize" placeholder="Gbps / Mpps">
        </div>
      </div>
      <div class="field">
        <label>L3/L4 (network layer) or L7 (application layer) or both?</label>
        <input type="text" name="appServices.ddosLayers">
      </div>

      <h3>1.4 DNS</h3>
      <div class="field-row">
        <div class="field">
          <label>Current authoritative DNS provider</label>
          <input type="text" name="appServices.dnsProvider">
        </div>
        <div class="field">
          <label>Number of DNS records / zones</label>
          <input type="text" name="appServices.dnsRecords">
        </div>
      </div>
      <div class="field">
        <label>Monthly DNS queries (if known)</label>
        <input type="text" name="appServices.dnsQueries">
      </div>
    </div>

    <!-- Section 2: Zero Trust -->
    <div class="section">
      <h2>Section 2: Zero Trust</h2>
      <p class="covers">Covers: Access (ZTNA), Gateway (SWG), CASB, DLP, Browser Isolation, Email Security, Device Posture, WARP, Tunnel, Magic Transit, Magic WAN, Magic Firewall, Cloudflare Network Interconnect.</p>

      <h3>2.1 Identity &amp; Access (ZTNA)</h3>
      <div class="field-row">
        <div class="field">
          <label>Number of users / seats</label>
          <input type="text" name="zeroTrust.numUsers">
        </div>
        <div class="field">
          <label>Identity provider</label>
          <input type="text" name="zeroTrust.identityProvider" placeholder="Okta, Entra ID, Google Workspace, JumpCloud, other">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of internal applications to protect via Access</label>
          <input type="text" name="zeroTrust.numInternalApps">
        </div>
        <div class="field">
          <label>Interest in clientless access for contractors/BYOD?</label>
          <select name="zeroTrust.clientlessAccessInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current remote access solution</label>
          <input type="text" name="zeroTrust.currentRemoteAccess" placeholder="VPN, Zscaler ZPA, Palo Alto Prisma, etc.">
        </div>
        <div class="field">
          <label>Service tokens needed?</label>
          <input type="text" name="zeroTrust.serviceTokensNeeded">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in device posture checks?</label>
          <select name="zeroTrust.devicePostureInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Which endpoint management tool?</label>
          <input type="text" name="zeroTrust.endpointMgmtTool" placeholder="Jamf, Intune, etc.">
        </div>
      </div>

      <h3>2.2 Secure Web Gateway, CASB &amp; DLP</h3>
      <div class="field-row">
        <div class="field">
          <label>Interest in Cloudflare Gateway (SWG)?</label>
          <select name="zeroTrust.gatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Gateway — number of users (if yes)</label>
          <input type="text" name="zeroTrust.gatewayUsers">
        </div>
      </div>
      <div class="field">
        <label>Current SWG solution</label>
        <input type="text" name="zeroTrust.currentSWG" placeholder="Zscaler ZIA, Netskope, Palo Alto, Symantec, etc.">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in CASB?</label>
          <select name="zeroTrust.casbInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>CASB — which SaaS apps?</label>
          <input type="text" name="zeroTrust.casbApps" placeholder="M365, Google Workspace, Slack, etc.">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in DLP?</label>
          <select name="zeroTrust.dlpInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>DLP — what data types need protection?</label>
          <input type="text" name="zeroTrust.dlpDataTypes">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>HTTPS inspection requirement?</label>
          <select name="zeroTrust.httpsInspection"><option value="">— Select —</option><option>Yes</option><option>No</option></select>
        </div>
        <div class="field">
          <label>Interest in Browser Isolation?</label>
          <select name="zeroTrust.browserIsolationInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Browser Isolation — number of users who need it</label>
        <input type="text" name="zeroTrust.browserIsolationUsers">
      </div>

      <h3>2.3 Email Security</h3>
      <div class="field-row">
        <div class="field">
          <label>Current email provider</label>
          <input type="text" name="zeroTrust.emailProvider" placeholder="M365, Google Workspace, on-prem Exchange">
        </div>
        <div class="field">
          <label>Number of mailboxes</label>
          <input type="text" name="zeroTrust.numMailboxes">
        </div>
      </div>
      <div class="field">
        <label>Current email security solution</label>
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
        <label>Daily email volume (if known)</label>
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
          <label>Number of branch sites / data centres to connect</label>
          <input type="text" name="zeroTrust.numBranchSites">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Current WAN / SD-WAN vendor (if any)</label>
          <input type="text" name="zeroTrust.currentWAN">
        </div>
        <div class="field">
          <label>BGP ASN (if Magic Transit or Magic WAN)</label>
          <input type="text" name="zeroTrust.bgpAsn">
        </div>
      </div>
      <div class="field">
        <label>IP ranges / CIDR blocks to advertise or protect</label>
        <textarea name="zeroTrust.ipRanges" placeholder="e.g., 203.0.113.0/24, 198.51.100.0/24"></textarea>
      </div>
    </div>

    <!-- Section 3: Developer Platform -->
    <div class="section">
      <h2>Section 3: Developer Platform</h2>
      <p class="covers">Covers: Workers, Pages, R2, D1, KV, Queues, Durable Objects, Workers AI, Vectorize, Hyperdrive, AI Gateway, Browser Run, AI Search.</p>

      <h3>3.1 Compute (Workers &amp; Pages)</h3>
      <div class="field-row">
        <div class="field">
          <label>Estimated monthly Worker requests</label>
          <input type="text" name="developer.workerRequests" placeholder="e.g., 10M, 100M, 1B">
        </div>
        <div class="field">
          <label>Average Worker CPU time per request (ms)</label>
          <input type="text" name="developer.workerCpuTime">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Number of Worker scripts / projects planned</label>
          <input type="text" name="developer.numWorkerScripts">
        </div>
        <div class="field">
          <label>Interest in Pages?</label>
          <select name="developer.pagesInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Current serverless platform</label>
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
          <label>R2 — estimated storage (TB)</label>
          <input type="text" name="developer.r2Storage">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>R2 — estimated monthly Class A operations</label>
          <input type="text" name="developer.r2ClassAOps">
        </div>
        <div class="field">
          <label>R2 — estimated monthly Class B operations</label>
          <input type="text" name="developer.r2ClassBOps">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in D1?</label>
          <select name="developer.d1Interest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>D1 — number of databases</label>
          <input type="text" name="developer.d1NumDatabases">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in KV?</label>
          <select name="developer.kvInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>KV — estimated read/write volume</label>
          <input type="text" name="developer.kvVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Queues?</label>
          <select name="developer.queuesInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Queues — estimated messages/month</label>
          <input type="text" name="developer.queuesVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Durable Objects?</label>
          <select name="developer.durableObjectsInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>DO — estimated objects / requests</label>
          <input type="text" name="developer.doVolume">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Hyperdrive?</label>
          <select name="developer.hyperdriveInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Hyperdrive — which DB?</label>
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
          <label>Workers AI — estimated monthly inference requests</label>
          <input type="text" name="developer.aiInferenceRequests">
        </div>
      </div>
      <div class="field">
        <label>Which model types?</label>
        <input type="text" name="developer.aiModelTypes" placeholder="LLM text generation, image classification, speech-to-text, embeddings">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in Vectorize?</label>
          <select name="developer.vectorizeInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Vectorize — estimated vectors and dimensions</label>
          <input type="text" name="developer.vectorizeVectors" placeholder="e.g., 100k vectors, 768 dims">
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Interest in AI Gateway?</label>
          <select name="developer.aiGatewayInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
        <div class="field">
          <label>Interest in Browser Run?</label>
          <select name="developer.browserRunInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Browser Run — estimated sessions/month</label>
          <input type="text" name="developer.browserRunSessions">
        </div>
        <div class="field">
          <label>Interest in AI Search?</label>
          <select name="developer.aiSearchInterest"><option value="">— Select —</option><option>Yes</option><option>No</option><option>Maybe</option></select>
        </div>
      </div>
      <div class="field">
        <label>Current AI / ML infrastructure</label>
        <input type="text" name="developer.currentAiInfra" placeholder="AWS Bedrock, OpenAI API, Azure OpenAI, self-hosted GPUs">
      </div>
    </div>

    <!-- Section 4: Additional -->
    <div class="section">
      <h2>Section 4: Additional Information</h2>
      <div class="field">
        <label>Any products or features not listed above that you are interested in?</label>
        <textarea name="additional.otherProducts"></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Expected budget range (if comfortable sharing)</label>
          <input type="text" name="additional.budgetRange">
        </div>
        <div class="field">
          <label>Any specific timeline or deadline for deployment?</label>
          <input type="text" name="additional.timeline">
        </div>
      </div>
      <div class="field">
        <label>Competitive situation — evaluating against which vendor?</label>
        <input type="text" name="additional.competitiveVendor">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Professional services or onboarding assistance needed?</label>
          <input type="text" name="additional.psNeeded">
        </div>
        <div class="field">
          <label>Custom contracting requirements (MSA, custom DPA, etc.)?</label>
          <input type="text" name="additional.customContracting">
        </div>
      </div>
      <div class="field">
        <label>Additional comments or context</label>
        <textarea name="additional.comments"></textarea>
      </div>
    </div>

    <button type="button" class="submit-btn" id="submitBtn" onclick="submitForm()">Submit Questionnaire</button>
  </div>

  <div class="footer">Cloudflare Customer Information Questionnaire · Powered by Cloudflare Workers &amp; R2</div>

  <script>
    function flattenForm() {
      const els = document.querySelectorAll('input, select, textarea');
      const data = {};
      els.forEach(el => { if (el.name) data[el.name] = el.value.trim(); });
      return data;
    }
    async function submitForm() {
      const btn = document.getElementById('submitBtn');
      const alertEl = document.getElementById('alert');
      btn.disabled = true; btn.textContent = 'Submitting...';
      const required = document.querySelectorAll('[required]');
      for (const el of required) {
        if (!el.value.trim()) {
          el.focus(); el.style.borderColor = '#e74c3c';
          alertEl.className = 'alert error';
          alertEl.textContent = 'Please fill in all required fields (marked with *).';
          alertEl.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Submit Questionnaire';
          return;
        }
      }
      try {
        const flat = flattenForm();
        const nested = {};
        for (const [key, val] of Object.entries(flat)) {
          const parts = key.split('.');
          if (parts.length === 2) { if (!nested[parts[0]]) nested[parts[0]] = {}; nested[parts[0]][parts[1]] = val; }
          else nested[key] = val;
        }
        const resp = await fetch('/api/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(nested) });
        if (resp.ok) {
          alertEl.className = 'alert success';
          alertEl.textContent = '✅ Thank you! Your questionnaire has been submitted successfully.';
          alertEl.style.display = 'block';
          window.scrollTo({ top:0, behavior:'smooth' });
          btn.textContent = 'Submitted ✓';
          document.querySelectorAll('input, select, textarea').forEach(el => { if(el.name) el.value=''; });
        } else throw new Error('Submission failed');
      } catch {
        alertEl.className = 'alert error';
        alertEl.textContent = '❌ Something went wrong. Please try again.';
        alertEl.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Submit Questionnaire';
      }
    }
  </script>
</body>
</html>`;
}
