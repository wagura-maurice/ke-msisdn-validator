/**
 * ke-msisdn-validator — TypeScript declarations.
 * Ships with the package so TypeScript consumers don't need local shims.
 */

export type KenyaOperator =
  | 'Safaricom'
  | 'Airtel'
  | 'Telkom'
  | 'Faiba4g'
  | 'Equitel'
  | 'Invalid Operator'

/** Normalize any Kenyan format to `254XXXXXXXXX`, or an "Invalid…" sentinel string. */
export function FormatNumbers(phone: string): string

/** Original allocation operator of a 254-formatted number. */
export function checkOperator(phone: string): KenyaOperator

/** True for any valid Kenyan mobile format (07x/01x) — STK pre-check. */
export function isMpesaCompatible(phone: string): boolean

/** Alias of isMpesaCompatible. */
export function isStkCompatible(phone: string): boolean

/** Normalize any Kenyan mobile number to `254XXXXXXXXX`, or null. */
export function normalizeMsisdn(phone: string): string | null

/** True when the number sits in a Safaricom allocation block (MNP caveat applies). */
export function isSafaricom(phone: string): boolean

/** `254XXXXXXXXX` only when Safaricom-allocated, otherwise null — the M-Pesa gate. */
export function normalizeSafaricom(phone: string): string | null

export interface ParsedMsisdn {
  /** 254XXXXXXXXX — canonical storage form. */
  msisdn: string
  /** +254XXXXXXXXX */
  e164: string
  /** 07XX XXX XXX national display form. */
  national: string
  /** +254 7XX XXX XXX international display form. */
  international: string
  /** Operator from the CA prefix tables (original allocation). */
  operator: KenyaOperator
  /** libphonenumber mobile-line type check. */
  isMobile: boolean
  /** Strict E.164 validity for Kenya (false when only the lenient fallback matched). */
  isValid: boolean
}

/** Rich parse: strict libphonenumber-js validation + prefix-table operator. */
export function parseMsisdn(phone: string): ParsedMsisdn | null
