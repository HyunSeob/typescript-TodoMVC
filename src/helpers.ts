function token(): string {
  return Math.floor((Math.random() + 1) * 0x10000)
    .toString(16)
    .substring(1);
}

export function guid(): string {
  /**
   * Generate a GUID.
   *
   * @example guid();
   */
  return [
    token() + token(),
    token(),
    token(),
    token(),
    token() + token()
  ].join('-');
}
