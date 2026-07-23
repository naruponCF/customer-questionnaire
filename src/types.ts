export interface Env {
  QUESTIONNAIRE_BUCKET: R2Bucket;
  JWT_SECRET: string;
  ADMIN_PASSWORDS: string;   // bootstrap fallback (JSON map)
  ADMIN_USERS: string;        // bootstrap fallback (JSON array)
}

export interface UserRecord {
  username: string;
  role: "superadmin" | "user";
  distributor?: string; // "SoftDebut" | "Nforce" — only for role=user
  passwordHash: string;
}

export interface QuestionnaireSubmission {
  id: string;
  submittedAt: string;
  distributor: string; // "SoftDebut" | "Nforce" | "" — set by superadmin
  general: {
    companyName: string;
    country: string;
    websiteDomains: string;
    currentPlan: string;
    currentVendor: string;
    techContact: string;
    billingContact: string;
    contractTerm: string;
    targetStartDate: string;
    complianceRequirements: string;
    dataResidency: string;
    existingAccountId: string;
  };
  appServices: {
    avgMonthlyRequests: string;
    avgMonthlyBandwidthTB: string;
    numHostnames: string;
    originInfra: string;
    currentCDN: string;
    latencySLA: string;
    currentWAF: string;
    numWebApps: string;
    securityConcerns: string;
    botManagementInterest: string;
    numAPIs: string;
    apiGatewayInterest: string;
    wafComplianceDrivers: string;
    ddosExperienced: string;
    currentDDoS: string;
    peakAttackSize: string;
    ddosLayers: string;
    dnsProvider: string;
    dnsRecords: string;
    dnsQueries: string;
  };
  zeroTrust: {
    numUsers: string;
    identityProvider: string;
    numInternalApps: string;
    clientlessAccessInterest: string;
    currentRemoteAccess: string;
    serviceTokensNeeded: string;
    devicePostureInterest: string;
    endpointMgmtTool: string;
    gatewayInterest: string;
    gatewayUsers: string;
    currentSWG: string;
    casbInterest: string;
    casbApps: string;
    dlpInterest: string;
    dlpDataTypes: string;
    httpsInspection: string;
    browserIsolationInterest: string;
    browserIsolationUsers: string;
    emailProvider: string;
    numMailboxes: string;
    currentEmailSecurity: string;
    area1Interest: string;
    phishGuardInterest: string;
    dailyEmailVolume: string;
    tunnelInterest: string;
    magicTransitInterest: string;
    magicWanInterest: string;
    magicFirewallInterest: string;
    cniInterest: string;
    numBranchSites: string;
    currentWAN: string;
    bgpAsn: string;
    ipRanges: string;
  };
  developer: {
    workerRequests: string;
    workerCpuTime: string;
    numWorkerScripts: string;
    pagesInterest: string;
    currentServerless: string;
    workersLogsInterest: string;
    traceEventsInterest: string;
    r2Interest: string;
    r2Storage: string;
    r2ClassAOps: string;
    r2ClassBOps: string;
    d1Interest: string;
    d1NumDatabases: string;
    kvInterest: string;
    kvVolume: string;
    queuesInterest: string;
    queuesVolume: string;
    durableObjectsInterest: string;
    doVolume: string;
    hyperdriveInterest: string;
    hyperdriveDb: string;
    workersAiInterest: string;
    aiInferenceRequests: string;
    aiModelTypes: string;
    vectorizeInterest: string;
    vectorizeVectors: string;
    vectorizeDimensions: string;
    aiGatewayInterest: string;
    browserRunInterest: string;
    browserRunSessions: string;
    aiSearchInterest: string;
    currentAiInfra: string;
  };
  additional: {
    otherProducts: string;
    budgetRange: string;
    timeline: string;
    competitiveVendor: string;
    psNeeded: string;
    customContracting: string;
    comments: string;
  };
}
