export function notFoundMessage(
  entify: string,
  attribute: string,
  value: string,
): string {
  return `${entify} with ${attribute} ${value} not found`
}

export function valueIsInvalidMessage(
  entify: string,
  attribute: string,
  value: string,
): string {
  return `${entify} with ${attribute} ${value} is invalid`
}

export function valueIsRequireMessage(
  entify: string,
  attribute: string,
): string {
  return `${entify} with ${attribute} is require`
}

export function alreadyExistsMessage(
  entify: string,
  attribute: string,
  value: string,
): string {
  return `${entify} with ${attribute} ${value} already exists`
}

export function envVarNotSetMessage(varName: string): string {
  return `Environment variable '${varName}' is not set`;
}
