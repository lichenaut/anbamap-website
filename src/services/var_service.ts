export class EnvService {
  static getEnvVar(envVar: string): string | undefined {
    let envVarValue = process.env[envVar];
    if (envVarValue !== undefined) {
      return envVarValue;
    }
  }
}
