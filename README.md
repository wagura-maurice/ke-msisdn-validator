# ke-msisdn-validator

> **Fork notice:** this package is a maintained fork of
> [bnjunge/phone-formatter-ke](https://github.com/bnjunge/phone-formatter-ke)
> (MIT). It inherits the original formatting logic but adds support for the
> current Kenyan numbering plan (the 01xx series that Safaricom now issues)
> and helpers built specifically for **M-PESA compatibility checking**.

Validate, format, and identify Kenyan phone numbers (MSISDN): normalize any
input to E.164 `254XXXXXXXXX`, determine the telecom provider the number was
originally allocated to (Safaricom, Airtel, Telkom, Faiba4g, Equitel), and
check whether a number is compatible with **Safaricom M-PESA** — i.e.
suitable for **STK Push / Lipa Na M-PESA Online (Daraja)**.

## Why this exists

The classic `07xx` number range on Safaricom has been exhausted. Since 2020
Kenyan operators issue numbers in the `01xx` family, and in **August 2026
Safaricom added `0118`, `0119`, `0140–0143` and `0180–0182`**. Older
libraries only know `07xx` (and a couple of early `01xx` blocks), so they
reject valid Kenyan numbers. This fork keeps the prefix tables up to date.

## Installation

```bash
npm install ke-msisdn-validator
```

## Usage

```js
const {
    FormatNumbers,
    checkOperator,
    isMpesaCompatible,
    isStkCompatible
} = require('ke-msisdn-validator');

// Normalize any format to 254XXXXXXXXX
FormatNumbers('0711123123');        // "254711123123"
FormatNumbers('+254 711 123 123');  // "254711123123"
FormatNumbers('0111123123');        // "254111123123"   (01xx works)

// Original-operator identification
checkOperator('254711123123');      // "Safaricom"
checkOperator('254110123123');      // "Safaricom"      (0110)
checkOperator('254140123123');      // "Safaricom"      (0140, Aug 2026)
checkOperator('254101123123');      // "Airtel"         (0101 is Airtel)

// M-PESA compatibility (latest prefixes included)
isMpesaCompatible('0118123123');    // true             (0118)
isMpesaCompatible('0140123123');    // true             (0140)
isMpesaCompatible('0182123123');    // true             (0182)
isMpesaCompatible('0700123123');    // true             (legacy 07xx)
isMpesaCompatible('5111123123');    // false
```

## API

| Function | Description |
| --- | --- |
| `parseMsisdn(phone)` | **v1.1.0** — Rich parse via `libphonenumber-js`: strict E.164 validity, display formats, and operator. Returns `{ msisdn, e164, national, international, operator, isMobile, isValid }` or `null`. |
| `normalizeMsisdn(phone)` | **v1.1.0** — Clean normalize to `254XXXXXXXXX` or `null` (no sentinel strings). |
| `normalizeSafaricom(phone)` | **v1.1.0** — The M-Pesa gate: `254XXXXXXXXX` only when the number sits in a Safaricom block, else `null`. One call replaces `FormatNumbers` + `checkOperator` composed by hand. |
| `isSafaricom(phone)` | **v1.1.0** — Boolean form of the Safaricom gate. |
| `FormatNumbers(phone)` | Legacy normalizer — returns `"Invalid Phone Number ..."` sentinel on failure. Prefer `normalizeMsisdn` in new code. |
| `checkOperator(phone)` | Original operator for a 254-formatted number. |
| `isMpesaCompatible(phone)` | Boolean — any valid Kenyan mobile format (`07x`/`01x`). Safe STK pre-check. |
| `isStkCompatible(phone)` | Alias of `isMpesaCompatible`. |

### New in v1.1.0

- **`libphonenumber-js` backed `parseMsisdn`** — strict Google-metadata
  validation plus national/international display formats; operator still
  comes from the CA prefix tables (libphonenumber carries no KE carrier data).
- **Bundled TypeScript declarations** (`src/index.d.ts`) — consumers no
  longer need local `declare module` shims.
- **Composed Safaricom helpers** — the `normalize → must be Safaricom`
  pattern M-Pesa apps reimplement is now one call.

```js
const { parseMsisdn, normalizeSafaricom, isSafaricom } = require('ke-msisdn-validator')

normalizeSafaricom('0712 345 678')   // "254712345678"
normalizeSafaricom('0735123456')     // null  (Airtel — not M-Pesa)
isSafaricom('+254118123123')         // true

parseMsisdn('0712 345 678')
// {
//   msisdn: '254712345678', e164: '+254712345678',
//   national: '0712 345678', international: '+254 712 345678',
//   operator: 'Safaricom', isMobile: true, isValid: true
// }
```

## M-PESA / STK Push guidance (important)

This library is a **fast client-side pre-check** only. Two things matter for
real payments:

1. **Number Portability (MNP).** A prefix identifies the block where a
   number was originally allocated — not the network it is currently on. A
   `07xx`/`01xx` number may have been ported to another operator. Treat
   `isMpesaCompatible()` as "this is a plausible M-PESA-capable number",
   not as a guarantee.
2. **Authoritative answer = Daraja.** The Safaricom Daraja API
   (`mpesaexpressrequest` / STK Push) itself validates the MSISDN and
   returns a `ResultCode`. Always read the API response and use that as the
   final gate before treating a payment as initiated.

Because new `01xx` ranges can be issued at any time, `isMpesaCompatible()`
accepts **any** valid `07x`/`01x` number rather than a closed list — so a
new prefix is never wrongly rejected. The operator tables in `checkOperator`
are updated as CA Kenya allocations are published.

## Prefix data (updated August 2026)

| Operator | Ranges |
| --- | --- |
| Safaricom | `0700-0729, 0740-43, 0745-46, 0748, 0757, 0759, 0768-69, 0790-93, 0797-99, 0110-0119, 0140-0143, 0180-0182` |
| Airtel | `0731-39, 0750-56, 0780-81, 0785-89, 0100-0103` |
| Telkom | `0770-0776` |
| Faiba4g | `0747` |
| Equitel | `0763-0765` |

## Tests

```bash
npm test
```

## Support

If you find this package useful, you can support the developer by buying
them a coffee:

<a href="https://www.patreon.com/c/montanabay39">
  <img src="https://img.shields.io/badge/Support%20me%20on-Patreon-F96854?logo=patreon&logoColor=white" alt="Support me on Patreon">
</a>

## License

MIT — fork of
[bnjunge/phone-formatter-ke](https://github.com/bnjunge/phone-formatter-ke)
which is also MIT. See `LICENSE` (original) for the upstream notice.