interface ISetupOptions {
  readonly mainVerificationKey: string;
  readonly signing: string;
}

interface ISetupResult {
  readonly mainVerificationKey: string;
  readonly signingKeys: string[];
  readonly verificationKeys: string[];
}

interface IKeyGenResult {
  readonly mainVerificationKey: string;
  readonly signingKeys: string[];
  readonly verificationKeys: string[];
}

// BLS based signature schemes

// RSA probably does not work

// uRSA has a BLS signature => do the WASM uRSA wrapper?

// naive signature scheme is the simplest

export interface IThresholdSignatureTask {
  setup(options: ISetupOptions): ISetupResult;
  keyGen(setupResult: ISetupResult): IKeyGenResult;
  signShare(): void;
  verifyShare(): void;
  combine(): void;
  verify(): void;
}
