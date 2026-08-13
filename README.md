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
| `FormatNumbers(phone)` | Normalizes to a 12-digit `254XXXXXXXXX` string, or `"Invalid Phone Number ..."` if the input is not a valid Kenyan number. |
| `checkOperator(phone)` | Returns the operator a 254-formatted number was **originally** allocated to: `"Safaricom"`, `"Airtel"`, `"Telkom"`, `"Faiba4g"`, `"Equitel"`, or `"Invalid Operator"`. |
| `isMpesaCompatible(phone)` | **Boolean** — true for any valid Kenyan mobile format (`07x` or `01x`, normalized to 12 digits). Safe pre-check for M-PESA STK push. |
| `isStkCompatible(phone)` | Alias of `isMpesaCompatible`. |

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