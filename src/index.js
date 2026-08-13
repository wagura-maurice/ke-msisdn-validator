/**
 * ke-msisdn-validator
 *
 * Fork of bnjunge/phone-formatter-ke (MIT). Updated prefix data for the
 * current Kenyan numbering plan and helpers that verify a number is
 * compatible with Safaricom M-PESA (STK push / Lipa Na M-PESA Online).
 *
 * NOTE ON ACCURACY:
 * - Prefix data reflects CA Kenya allocations as of August 2026, including
 *   the 01xx family (0110-0119, 0140-0143, 0180-0182) that Safaricom now
 *   issues as the 07xx range has been exhausted.
 * - The original package listed 254101 (0101) as Safaricom; that block was
 *   actually allocated to Airtel, so it has been corrected here.
 * - Because of Mobile Number Portability (MNP), a prefix identifies the
 *   block where a number was ORIGINALLY allocated, not the current network.
 *   isMpesaCompatible() therefore accepts any valid 07x/01x format and
 *   treats the Daraja (M-PESA) API response as the final authority.
 */

/**
 * Normalize any Kenyan phone number to 254XXXXXXXXX.
 * Accepts local (0711...), international (+254711...), and E.164 (254711...)
 * forms with arbitrary separators/spaces.
 *
 * @param {string} phone
 * @returns {string}
 */
function FormatNumbers(phone) {
    let phone_ = phone.replace(/\D/g, '')
    phone_ = phone_.toString()
    const length = phone_.length

    var _phone = ''
    if (length == 12 && phone_.substring(0, 3) == '254') {
        _phone = phone_
    } else if (length == 9 && phone_.substring(0, 1) == 7) {
        _phone = '254' + phone_
    } else if (length == 10 && phone_.substring(0, 1) == 0) {
        _phone = '254' + phone_.substring(1, 10)
    } else {
        _phone = 'Invalid Phone Number ' + phone
    }

    return _phone
}

/**
 * Prefix tables keyed by operator. Blocks are stored as 6-digit
 * "254xxx" prefixes for direct substring comparison.
 *
 * Updated August 2026:
 *  - Safaricom: full 07xx set + 0110-0119, 0140-0143, 0180-0182 (01xx).
 *  - Airtel:    07xx set + 0100-0103 (01xx).
 *  - 0101 moved from Safaricom to Airtel (CA allocation).
 */
function ISPProvider() {
    return {
        Safaricom: [
            // 07xx legacy
            '254700', '254701', '254702', '254703', '254704', '254705',
            '254706', '254707', '254708', '254709', '254710', '254711',
            '254712', '254713', '254714', '254715', '254716', '254717',
            '254718', '254719', '254720', '254721', '254722', '254723',
            '254724', '254725', '254726', '254727', '254728', '254729',
            '254740', '254741', '254742', '254743', '254745', '254746',
            '254748', '254757', '254759', '254768', '254769',
            '254790', '254791', '254792', '254793', '254797', '254798',
            '254799',
            // 01xx (07xx exhausted — issued from 2020)
            '254110', '254111', '254112', '254113', '254114', '254115',
            '254116', '254117', '254118', '254119',
            // 01xx new ranges (August 2026)
            '254140', '254141', '254142', '254143',
            '254180', '254181', '254182'
        ],
        Airtel: [
            '254731', '254732', '254733', '254734', '254735', '254736',
            '254737', '254738', '254739',
            '254750', '254751', '254752', '254753', '254754', '254755',
            '254756',
            '254780', '254781', '254785', '254786', '254787', '254788',
            '254789',
            // 01xx
            '254100', '254101', '254102', '254103'
        ],
        Telkom: [
            '254770', '254771', '254772', '254773', '254774', '254775',
            '254776'
        ],
        Faiba4g: [
            '254747'
        ],
        Equitel: [
            '254763', '254764', '254765'
        ]
    }
}

/**
 * Identify the operator (ISP/MVNO) that a 254-formatted number was
 * originally allocated to.
 *
 * @param {string|number} phone - expects a 254... formatted number
 * @returns {string}
 */
function checkOperator(phone) {
    const prefix_ke = (phone.toString()).substring(0, 6)
    const prefix = (phone.toString()).substring(0, 3)

    if (prefix !== '254') {
        return 'Invalid Operator'
    } else {
        const { Safaricom, Airtel, Telkom, Faiba4g, Equitel } = ISPProvider()

        return Safaricom.indexOf(prefix_ke) >= 0 ? 'Safaricom' :
            (Airtel.indexOf(prefix_ke) >= 0 ? 'Airtel' :
                (Telkom.indexOf(prefix_ke) >= 0 ? 'Telkom' :
                    (Faiba4g.indexOf(prefix_ke) >= 0 ? 'Faiba4g' :
                        (Equitel.indexOf(prefix_ke) >= 0 ? 'Equitel' :
                            'Invalid Operator'))))
    }
}

/**
 * Returns true when the number is in a valid Kenyan mobile format that can
 * be passed to M-PESA STK Push (Lipa Na M-PESA Online).
 *
 * Accepts any 07x or 01x number — including the 01xx ranges and any that
 * will be allocated after this package was published — because MNP means a
 * prefix cannot prove the current network. Use this as a fast client-side
 * pre-check; treat the Daraja API ResultCode as the authoritative answer.
 *
 * @param {string} phone
 * @returns {boolean}
 */
function isMpesaCompatible(phone) {
    const normalized = FormatNumbers(phone)
    if (normalized.startsWith('Invalid')) {
        return false
    }
    // Valid Kenyan mobile: 254 + 7xx or 1xx (07x/01x), 12 digits total.
    return /^254[17]\d{8}$/.test(normalized)
}

/**
 * Alias of isMpesaCompatible for callers that prefer the shorter name.
 */
function isStkCompatible(phone) {
    return isMpesaCompatible(phone)
}

module.exports = {
    FormatNumbers: FormatNumbers,
    checkOperator: checkOperator,
    isMpesaCompatible: isMpesaCompatible,
    isStkCompatible: isStkCompatible
}
