﻿////http://www.dafaweek.com/HebCal/HebCalSampleSource.php

//function H2G() {
//    nYearH = Number(nYearH)
//    nMonthH = Number(nMonthH)
//    nDateH = Number(nDateH)
//    alert(HebToGreg(nYearH, nMonthH, nDateH))
//}


companionApp.filter('hebrewDate', function HebrewDateFilter(dateFilter) {
    return function (date, format) {
        if (!date) return '';

        if (format == 'hebrew')
            return FormatDateH(GregToHeb(date));

        else if (format == 'hebrewDay')
            return getHebrewDay(GregToHeb(date));

        else if (format == 'hebrewMonth')
            return getHebrewMonth(GregToHeb(date));

        else if (format == 'holiday')
            return HolidayGet(date);

        else if (format == 'gregorian')
            return HebToGreg(date.getFullYear(), date.getMonth(), date.getDate());

        else if (format == 'isChag')
            return IsChag(date);

        else if (format == 'isErevChag')
            return IsErevChag(date);


    }
});
/*
  This code was converted to Java Script from my VB.Net program
  to convert Hebrew dates to and from Gregorian dates. I avoided
  using many optimization in order to make the logic clearer.

  These functions assume that all the current rules of the
  Hebrew calendar were always in existence (which is not true
  since the Hebrew calendar was not always fixed) and all the
  current rules of the Gregorian calendar were always in existence
  (which is not true).

  Here is a very brief description of the Hebrew calendar.

  The Hebrew calendar is a lunisolar calendar.  This means that
  the months are in sync with the moon and the years stay in sync
  with the sun.  A solar year is approximately 365.25 days.  A
  lunar month is approximately 29.5 days.  Twelve lunar months is
  approximately 354 days (12 * 29.5=354).  Thus, a lunar year of
  twelve months is 11.25 days shorter than the solar year. To make
  up for this shortfall, the Hebrew calendar adds a thirteenth
  month to seven years over a nineteen year period. Therefore, over
  a nineteen year period, the Hebrew calendar is approximately the
  same length as a nineteen year solar calendar.

  In order to understand this code, you must know the following
  terms:
    Molad - new moon. Hebrew months start around the day of the
            new moon
    Chalakim - 1 / 1080 of an hour or 3 1/3 seconds
    Tishrei - the first month of the Hebrew year (at least for
              these calculations)
    Rosh Hashanah - The Jewish new year which starts on Tishrei 1.

  The Hebrew calendar assumes the period of time between one new
  moon to the next is 29 days, 12 hours and 793 chalakim. The first
  molad after creation occurred on Monday, September, 7th -3760 at 5
  hours and 204 chalakim.  Technically, the Gregorian date would be
  in the year 3761 BCE because there was no year 0 in the Gregorian
  calendar, but we will use the year of -3760.

  Sample Usage:
     // Converts AdarB/7/5765 to 4/6/2005
     alert(HebToGreg(5765, 7, 26))

*/

// This function returns how many months there has been from the
// first Molad until the beginning of the year nYearH
function MonSinceFirstMolad(nYearH) {
    var nMonSinceFirstMolad

    // A shortcut to this function can simply be the following formula
    //   return Math.floor(((235 * nYearH) - 234) / 19)
    // This formula is found in Remy Landau's website and he
    // attributes it to Wolfgang Alexander Shochen. I will use a less
    // optimized function which I believe shows the underlying logic
    // better.

    // count how many months there has been in all years up to last
    // year. The months of this year hasn't happened yet.
    nYearH--

    // In the 19 year cycle, there will always be 235 months. That
    // would be 19 years times 12 months plus 7 extra month for the
    // leap years. (19 * 12) + 7 = 235.

    // Get how many 19 year cycles there has been and multiply it by
    // 235
    nMonSinceFirstMolad = Math.floor(nYearH / 19) * 235
    // Get the remaining years after the last complete 19 year cycle
    nYearH = nYearH % 19
    // Add 12 months for each of those years
    nMonSinceFirstMolad += 12 * nYearH
    // Add the extra months to account for the leap years
    if (nYearH >= 17) {
        nMonSinceFirstMolad += 6
    } else if (nYearH >= 14) {
        nMonSinceFirstMolad += 5
    } else if (nYearH >= 11) {
        nMonSinceFirstMolad += 4
    } else if (nYearH >= 8) {
        nMonSinceFirstMolad += 3
    } else if (nYearH >= 6) {
        nMonSinceFirstMolad += 2
    } else if (nYearH >= 3) {
        nMonSinceFirstMolad += 1
    }
    return nMonSinceFirstMolad
}

// This function returns if a given year is a leap year.
function IsLeapYear(nYearH) {
    var nYearInCycle

    // Find out which year we are within the cycle.  The 19th year of
    // the cycle will return 0
    nYearInCycle = nYearH % 19
    return (nYearInCycle == 3 ||
             nYearInCycle == 6 ||
             nYearInCycle == 8 ||
             nYearInCycle == 11 ||
             nYearInCycle == 14 ||
             nYearInCycle == 17 ||
             nYearInCycle == 0)
}

// This function figures out the Gregorian Date that corresponds to
// the first day of Tishrei, the first month of the Hebrew
// calendar, for a given Hebrew year.
function Tishrei1(nYearH) {
    var nMonthsSinceFirstMolad
    var nChalakim
    var nHours
    var nDays
    var nDayOfWeek
    var dTishrei1

    // We want to calculate how many days, hours and chalakim it has
    // been from the time of 0 days, 0 hours and 0 chalakim to the
    // molad at the beginning of year nYearH.
    //
    // The period between one new moon to the next is 29 days, 12
    // hours and 793 chalakim. We must multiply that by the amount
    // of months that transpired since the first molad. Then we add
    // the time of the first molad (Monday, 5 hours and 204 chalakim)
    nMonthsSinceFirstMolad = MonSinceFirstMolad(nYearH)
    nChalakim = 793 * nMonthsSinceFirstMolad
    nChalakim += 204
    // carry the excess Chalakim over to the hours
    nHours = Math.floor(nChalakim / 1080)
    nChalakim = nChalakim % 1080

    nHours += nMonthsSinceFirstMolad * 12
    nHours += 5

    // carry the excess hours over to the days
    nDays = Math.floor(nHours / 24)
    nHours = nHours % 24

    nDays += 29 * nMonthsSinceFirstMolad
    nDays += 2

    // figure out which day of the week the molad occurs.
    // Sunday = 1, Moday = 2 ..., Shabbos = 0
    nDayOfWeek = nDays % 7

    // In a perfect world, Rosh Hashanah would be on the day of the
    // molad. The Hebrew calendar makes four exceptions where we
    // push off Rosh Hashanah one or two days. This is done to
    // prevent three situation. Without explaining why, the three
    // situations are:
    //   1) We don't want Rosh Hashanah to come out on Sunday,
    //      Wednesday or Friday
    //   2) We don't want Rosh Hashanah to be on the day of the
    //      molad if the molad occurs after the beginning of 18th
    //      hour.
    //   3) We want to limit years to specific lengths.  For non-leap
    //      years, we limit it to either 353, 354 or 355 days.  For
    //      leap years, we limit it to either 383, 384 or 385 days.
    //      If setting Rosh Hashanah to the day of the molad will
    //      cause this year, or the previous year to fall outside
    //      these lengths, we push off Rosh Hashanah to get the year
    //      back to a valid length.
    // This code handles these exceptions.
    if (!IsLeapYear(nYearH) &&
        nDayOfWeek == 3 &&
        (nHours * 1080) + nChalakim >= (9 * 1080) + 204) {
        // This prevents the year from being 356 days. We have to push
        // Rosh Hashanah off two days because if we pushed it off only
        // one day, Rosh Hashanah would comes out on a Wednesday. Check
        // the Hebrew year 5745 for an example.
        nDayOfWeek = 5
        nDays += 2
    }
    else if (IsLeapYear(nYearH - 1) &&
              nDayOfWeek == 2 &&
              (nHours * 1080) + nChalakim >= (15 * 1080) + 589) {
        // This prevents the previous year from being 382 days. Check
        // the Hebrew Year 5766 for an example. If Rosh Hashanah was not
        // pushed off a day then 5765 would be 382 days
        nDayOfWeek = 3
        nDays += 1
    }
    else {
        // see rule 2 above. Check the Hebrew year 5765 for an example
        if (nHours >= 18) {
            nDayOfWeek += 1
            nDayOfWeek = nDayOfWeek % 7
            nDays += 1
        }
        // see rule 1 above. Check the Hebrew year 5765 for an example
        if (nDayOfWeek == 1 ||
            nDayOfWeek == 4 ||
            nDayOfWeek == 6) {
            nDayOfWeek += 1
            nDayOfWeek = nDayOfWeek % 7
            nDays += 1
        }
    }

    // Here we want to add nDays to creation
    //    dTishrie1 = creation + nDays
    // Unfortunately, Many languages do not handle negative years very
    // well. I therefore picked a Random date (1/1/1900) and figured out
    // how many days it is after the creation (2067025). Then I
    // subtracted 2067025 from nDays.
    nDays -= 2067025
    dTishrei1 = new Date(1900, 0, 1) // 2067025 days after creation
    dTishrei1.setDate(dTishrei1.getDate() + nDays)

    return dTishrei1
}


// This function gets the length of a Hebrew year.
function LengthOfYear(nYearH) {
    var dThisTishrei1
    var dNextTishrei1
    var diff

    // subtract the date of this year from the date of next year
    dThisTishrei1 = Tishrei1(nYearH)
    dNextTishrei1 = Tishrei1(nYearH + 1)
    // Java's dates are stored in milliseconds. To convert it into days
    // we have to divide it by 1000 * 60 * 60 * 24
    diff = (dNextTishrei1 - dThisTishrei1) / (1000 * 60 * 60 * 24)
    return Math.round(diff)
}

// This function converts a Hebrew date into the Gregorian date
// nYearH - is the Hebrew year
// nMonth - Tishrei=1
//          Cheshvan=2
//          Kislev=3
//          Teves=4
//          Shevat=5
//          Adar A=6 (only valid on leap years)
//          Adar=7   (Adar B for leap years)
//          Nisan=8
//          Iyar=9
//          Sivan=10
//          Tamuz=11
//          Av=12
//          Elul=13
function HebToGreg(nYearH, nMonthH, nDateH) {
    var nLengthOfYear
    var bLeap
    var dGreg
    var nMonth
    var nMonthLen
    var bHaser
    var bShalem

    bLeap = IsLeapYear(nYearH)
    nLengthOfYear = LengthOfYear(nYearH)

    // The regular length of a non-leap year is 354 days.
    // The regular length of a leap year is 384 days.
    // On regular years, the length of the months are as follows
    //   Tishrei (1)   30
    //   Cheshvan(2)   29
    //   Kislev  (3)   30
    //   Teves   (4)   29
    //   Shevat  (5)   30
    //   Adar A  (6)   30     (only valid on leap years)
    //   Adar    (7)   29     (Adar B for leap years)
    //   Nisan   (8)   30
    //   Iyar    (9)   29
    //   Sivan   (10)  30
    //   Tamuz   (11)  29
    //   Av      (12)  30
    //   Elul    (13)  29
    // If the year is shorter by one less day, it is called a haser
    // year. Kislev on a haser year has 29 days. If the year is longer
    // by one day, it is called a shalem year. Cheshvan on a shalem
    // year is 30 days.

    bHaser = (nLengthOfYear == 353 || nLengthOfYear == 383)
    bShalem = (nLengthOfYear == 355 || nLengthOfYear == 385)

    // get the date for Tishrei 1
    dGreg = Tishrei1(nYearH)

    // Now count up days within the year
    for (nMonth = 1; nMonth <= nMonthH - 1; nMonth++) {
        if (nMonth == 1 ||
            nMonth == 5 ||
            nMonth == 8 ||
            nMonth == 10 ||
            nMonth == 12) {
            nMonthLen = 30
        } else if (nMonth == 4 ||
                   nMonth == 7 ||
                   nMonth == 9 ||
                   nMonth == 11 ||
                   nMonth == 13) {
            nMonthLen = 29
        } else if (nMonth == 6) {
            nMonthLen = (bLeap ? 30 : 0)
        } else if (nMonth == 2) {
            nMonthLen = (bShalem ? 30 : 29)
        } else if (nMonth == 3) {
            nMonthLen = (bHaser ? 29 : 30)
        }
        dGreg.setDate(dGreg.getDate() + nMonthLen)
    }
    dGreg.setDate(dGreg.getDate() + nDateH - 1)
    return dGreg
}

// This function converts a Gregorian date into the Hebrew date.  The
// function returns the hebrew month as a string in the format M/D/Y.
// See function HebToGreg() for the definition of the month numbers.
function GregToHeb(dGreg) {
    var nYearH
    var nMonthH
    var nDateH
    var nOneMolad
    var nAvrgYear
    var nDays
    var dTishrei1
    var nLengthOfYear
    var bLeap
    var bHaser
    var bShalem
    var nMonthLen
    var bWhile
    var d1900 = new Date(1900, 0, 1)

    // The basic algorythm to get Hebrew date for the Gregorian date dGreg.
    // 1) Find out how many days dGreg is after creation.
    // 2) Based on those days, estimate the Hebrew year
    // 3) Now that we a good estimate of the Hebrew year, use brute force to
    //    find the Gregorian date for Tishrei 1 prior to or equal to dGreg
    // 4) Add to Tishrei 1 the amount of days dGreg is after Tishrei 1

    // Figure out how many days are in a month.
    // 29 days + 12 hours + 793 chalakim
    nOneMolad = 29 + (12 / 24) + (793 / (1080 * 24))
    // Figure out the average length of a year. The hebrew year has exactly
    // 235 months over 19 years.
    nAvrgYear = nOneMolad * (235 / 19)
    // Get how many days dGreg is after creation. See note as to why I
    // use 1/1/1900 and add 2067025
    nDays = Math.round((dGreg - d1900) / (24 * 60 * 60 * 1000))
    nDays += 2067025 // 2067025 days after creation
    // Guess the Hebrew year. This should be a pretty accurate guess.
    nYearH = Math.floor(nDays / nAvrgYear) + 1
    // Use brute force to find the exact year nYearH. It is the Tishrei 1 in
    // the year <= dGreg.
    dTishrei1 = Tishrei1(nYearH)

    if (SameDate(dTishrei1, dGreg)) {
        // If we got lucky and landed on the exact date, we can stop here
        nMonthH = 1
        nDateH = 1
    }
    else {
        // Here is the brute force.  Either count up or count down nYearH
        // until Tishrei 1 is <= dGreg.
        if (dTishrei1 < dGreg) {
            // If Tishrei 1, nYearH is less than dGreg, count nYearH up.
            while (Tishrei1(nYearH + 1) <= dGreg) {
                nYearH += 1
            }
        }
        else {
            // If Tishrei 1, nYearH is greater than dGreg, count nYearH down.
            nYearH -= 1
            while (Tishrei1(nYearH) > dGreg) {
                nYearH -= 1
            }
        }

        // Subtract Tishrei 1, nYearH from dGreg. That should leave us with
        // how many days we have to add to Tishrei 1
        nDays = (dGreg - Tishrei1(nYearH)) / (24 * 60 * 60 * 1000)
        nDays = Math.round(nDays)
        // Find out what type of year it is so that we know the length of the
        // months
        nLengthOfYear = LengthOfYear(nYearH)
        bHaser = nLengthOfYear == 353 || nLengthOfYear == 383
        bShalem = nLengthOfYear == 355 || nLengthOfYear == 385
        bLeap = IsLeapYear(nYearH)

        // Add nDays to Tishrei 1.
        nMonthH = 1
        do {

            switch (nMonthH) {
                case 1:
                case 5:
                case 6:
                case 8:
                case 10:
                case 12:
                    nMonthLen = 30
                    break
                case 4:
                case 7:
                case 9:
                case 11:
                case 13:
                    nMonthLen = 29
                    break
                case 6: // Adar A (6) will be skipped on non-leap years
                    nMonthLen = 30
                    break
                case 2: // Cheshvan, see note above
                    nMonthLen = (bShalem ? 30 : 29)
                    break
                case 3: // Kislev, see note above
                    nMonthLen = (bHaser ? 29 : 30)
                    break
            }

            if (nDays >= nMonthLen) {
                bWhile = true
                if (bLeap || nMonthH != 5) {
                    nMonthH++
                }
                else {
                    // We can skip Adar A (6) if its not a leap year
                    nMonthH += 2
                }
                nDays -= nMonthLen
            }
            else {
                bWhile = false
            }
        } while (bWhile)
        //Add the remaining days to Date
        nDateH = nDays + 1
    }
    return nMonthH + "/" + nDateH// + "/" + nYearH
}

function SameDate(d1, d2) {
    return (d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() == d2.getMonth() &&
            d1.getDate() == d2.getDate())

}

// Here are a few support functions for the sample web page

function FormatDateH(cDate) {
    var aDate = new Array()
    var cFormatDate
    var cFormatYear = '';
    var cFormatMonth = '';
    var cFormatDay = "";
    aDate = cDate.split("/")
    switch (Number(aDate[0])) {
        case 1:
            cFormatMonth = "תשרי"
            break
        case 2:
            cFormatMonth = "חשון"
            break
        case 3:
            cFormatMonth = "כסלו"
            break
        case 4:
            cFormatMonth = "טבת"
            break
        case 5:
            cFormatMonth = "שבט"
            break
        case 6:
            cFormatMonth = "אדר א'"
            break
        case 7:
            cFormatMonth = (IsLeapYear(Number(aDate[2])) ? "אדר ב'" : "אדר")
            break
        case 8:
            cFormatMonth = "ניסן"
            break
        case 9:
            cFormatMonth = "אייר"
            break
        case 10:
            cFormatMonth = "סיון"
            break
        case 11:
            cFormatMonth = "תמוז"
            break
        case 12:
            cFormatMonth = "אב"
            break
        case 13:
            cFormatMonth = "אלול"
            break
    }
    switch (Number(aDate[1])) {
        case 1: cFormatDay = "א'"; break;
        case 2: cFormatDay = "ב'"; break;
        case 3: cFormatDay = "ג'"; break;
        case 4: cFormatDay = "ד'"; break;
        case 5: cFormatDay = "ה'"; break;
        case 6: cFormatDay = "ו'"; break;
        case 7: cFormatDay = "ז'"; break;
        case 8: cFormatDay = "ח'"; break;
        case 9: cFormatDay = "ט'"; break;
        case 10: cFormatDay = "י'"; break;
        case 11: cFormatDay = 'י"א'; break;
        case 12: cFormatDay = 'י"ב'; break;
        case 13: cFormatDay = 'י"ג'; break;
        case 14: cFormatDay = 'י"ד'; break;
        case 15: cFormatDay = 'ט"ו'; break;
        case 16: cFormatDay = 'ט"ז'; break;
        case 17: cFormatDay = 'י"ז'; break;
        case 18: cFormatDay = 'י"ח'; break;
        case 19: cFormatDay = 'י"ט'; break;
        case 20: cFormatDay = "כ'"; break;
        case 21: cFormatDay = 'כ"א'; break;
        case 22: cFormatDay = 'כ"ב'; break;
        case 23: cFormatDay = 'כ"ג'; break;
        case 24: cFormatDay = 'כ"ד'; break;
        case 25: cFormatDay = 'כ"ה'; break;
        case 26: cFormatDay = 'כ"ו'; break;
        case 27: cFormatDay = 'כ"ז'; break;
        case 28: cFormatDay = 'כ"ח'; break;
        case 29: cFormatDay = 'כ"ט'; break;
        case 30: cFormatDay = "ל'"; break;
    }

    var lettersNum = [
        400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30,
        20, 16, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    var lettersStr = [
        'ת', 'ש', 'ר', 'ק', 'צ', 'פ', 'ע', 'ס', 'נ', 'מ',
        'ל', 'כ', 'טז', 'טו', 'י', 'ט', 'ח', 'ז', 'ו', 'ה',
        'ד', 'ג', 'ב', 'א'];

    var y = Number(aDate[2]) / 1000;
    if (y > 0)
        cFormatYear += lettersStr[24 - (Math.floor(y))] + "'"
    var iYear = Number(aDate[2]) % 1000;
    index = 0;
    while (iYear > 0) {
        if (iYear >= 17 && iYear <= 19 && lettersNum[index] == 16)
            index += 2;
        num = Math.floor(iYear / lettersNum[index]);
        if (num > 0) {
            for (dup = 0; dup < num; dup++)
                cFormatYear += lettersStr[index];
            iYear %= lettersNum[index];
        }
        index++;
    }

    len = cFormatYear.length;
    if (len > 1)
        cFormatYear = cFormatYear.substring(0, len - 1) + '"' + cFormatYear.substring(len - 1, len);



    return cFormatDay + " " + cFormatMonth + " " + cFormatYear;
}

function getHebrewDay(cDate) {
    var aDate = new Array()
    var cFormatDate
    var cFormatYear = '';
    aDate = cDate.split("/")

    switch (Number(aDate[1])) {
        case 1: cFormatDay = "א'"; break;
        case 2: cFormatDay = "ב'"; break;
        case 3: cFormatDay = "ג'"; break;
        case 4: cFormatDay = "ד'"; break;
        case 5: cFormatDay = "ה'"; break;
        case 6: cFormatDay = "ו'"; break;
        case 7: cFormatDay = "ז'"; break;
        case 8: cFormatDay = "ח'"; break;
        case 9: cFormatDay = "ט'"; break;
        case 10: cFormatDay = "י'"; break;
        case 11: cFormatDay = 'י"א'; break;
        case 12: cFormatDay = 'י"ב'; break;
        case 13: cFormatDay = 'י"ג'; break;
        case 14: cFormatDay = 'י"ד'; break;
        case 15: cFormatDay = 'ט"ו'; break;
        case 16: cFormatDay = 'ט"ז'; break;
        case 17: cFormatDay = 'י"ז'; break;
        case 18: cFormatDay = 'י"ח'; break;
        case 19: cFormatDay = 'י"ט'; break;
        case 20: cFormatDay = "כ'"; break;
        case 21: cFormatDay = 'כ"א'; break;
        case 22: cFormatDay = 'כ"ב'; break;
        case 23: cFormatDay = 'כ"ג'; break;
        case 24: cFormatDay = 'כ"ד'; break;
        case 25: cFormatDay = 'כ"ה'; break;
        case 26: cFormatDay = 'כ"ו'; break;
        case 27: cFormatDay = 'כ"ז'; break;
        case 28: cFormatDay = 'כ"ח'; break;
        case 29: cFormatDay = 'כ"ט'; break;
        case 30: cFormatDay = "ל'"; break;
    }


    return cFormatDay;
}

function getHebrewMonth(cDate) {
    var aDate = new Array()
    var cFormatDate
    var cFormatMonth = '';
    aDate = cDate.split("/")

    switch (Number(aDate[0])) {
        case 1:
            cFormatMonth = "תשרי"
            break
        case 2:
            cFormatMonth = "חשון"
            break
        case 3:
            cFormatMonth = "כסלו"
            break
        case 4:
            cFormatMonth = "טבת"
            break
        case 5:
            cFormatMonth = "שבט"
            break
        case 6:
            cFormatMonth = "אדר א'"
            break
        case 7:
            cFormatMonth = (IsLeapYear(Number(aDate[2])) ? "אדר ב'" : "אדר")
            break
        case 8:
            cFormatMonth = "ניסן"
            break
        case 9:
            cFormatMonth = "אייר"
            break
        case 10:
            cFormatMonth = "סיון"
            break
        case 11:
            cFormatMonth = "תמוז"
            break
        case 12:
            cFormatMonth = "אב"
            break
        case 13:
            cFormatMonth = "אלול"
            break
    }
    return cFormatMonth;
}

function DOW(day, month, year) {
    var a = Math.floor((14 - month) / 12);
    var y = year - a;
    var m = month + 12 * a - 2;
    var d = (day + y + Math.floor(y / 4) - Math.floor(y / 100) +
			Math.floor(y / 400) + Math.floor((31 * m) / 12)) % 7;
    return d + 1;
}
function HolidayGet(date) {
    var day = new Date(date).getDate();
    var month = new Date(date).getMonth() + 1;
    var year = new Date(date).getYear();
    if (year < 1900)
        year += 1900;
    var cDate = GregToHeb(date);
    var aDate = cDate.split("/");
    return HoliDayNameGet(date, aDate[1], aDate[0], aDate[2], DOW(day, month, year));
}
function HoliDayNameGet(gDate, hday, hmonth, hyear, dow) {
    if (hmonth == 1) {
        if (hday == 1 || hday == 2)
            return "ראש השנה"
        else if (hday == 3 && dow != 7)
            return "צום גדליה";
        else if (hday == 4 && dow == 1)
            return "צום גדליה";
        else if (hday == 10)
            return "יום כיפור"
        else if (hday >= 15 && hday <= 21)
            return "סוכות"
        else if (hday == 22)
            return "שמחת תורה"
        else if (hday == 23)
            return "אסרו חג"
    }
    else if (hmonth == 3) {
        if (hday >= 25)
            return "חנוכה"
    }
    else if (hmonth == 4) {
        if (hday <= 2) {
            return "חנוכה"
        }
        else if (hday == 3) {
            var cDate = GregToHeb(new Date(gDate.setDate(gDate.getDate() - 3)));
            if (cDate.split("/")[1] == 29)
                return "חנוכה"
        }
        else if (hday == 10)
            return "צום י' בטבת"
    }
    else if (hmonth == 5) {
        if (hday == 15)
            return "טו בשבט"
    }
    else if (hmonth == 7) {
        if (hday == 11 && dow == 5)
            return "תענית אסתר"
        else if (hday == 13 && dow != 7)
            return "תענית אסתר"
        else if (hday == 14)
            return "פורים"
        else if (hday == 15)
            return "שושן פורים"
    }
    else if (hmonth == 8) {
        if (hday >= 15 && hday <= 21)
            return "פסח"
        else if (hday == 22)
            return "אסרו חג"
    }
    else if (hmonth == 9) {
        if (hday == 3 && dow == 5)
            return "יום העצמאות"
        else if (hday == 4 && dow == 5)
            return "יום העצמאות"
        else if (hday == 5 && dow != 6 && dow != 7)
            return "יום העצמאות"
        if (hday == 14)
            return "פסח שני"
        else if (hday == 18)
            return "לג בעומר"

    }
    else if (hmonth == 10) {
        if (hday == 6)
            return "שבועות"
        else if (hday == 7)
            return "אסרו חג"
    }
    else if (hmonth == 11) {
        if (hday == 17 && dow != 7)
            return "צום י\"ז בתמוז"
        if (hday == 18 && dow == 1)
            return "צום י\"ז בתמוז"
    }
    else if (hmonth == 12) {
        if (hday == 9 && dow != 7)
            return "ט' באב"
        if (hday == 10 && dow == 1)
            return "ט' באב"
        if (hday == 15)
            return "ט\"ו באב"
    }

    return "";
}

function IsChag(date) {
    var day = new Date(date).getDate();
    var month = new Date(date).getMonth() + 1;
    var year = new Date(date).getYear();
    if (year < 1900)
        year += 1900;
    var cDate = GregToHeb(date);
    var aDate = cDate.split("/");
    return GetChag(date, aDate[1], aDate[0], aDate[2], DOW(day, month, year));
}

function IsErevChag(date) {
    var day = new Date(date).getDate();
    var month = new Date(date).getMonth() + 1;
    var year = new Date(date).getYear();
    if (year < 1900)
        year += 1900;
    var cDate = GregToHeb(date);
    var aDate = cDate.split("/");
    return GetErevChag(date, aDate[1], aDate[0], aDate[2], DOW(day, month, year));
}

function GetChag(gDate, hday, hmonth, hyear, dow) {
    if (hmonth == 1) {
        if (hday == 1 || hday == 2)
            return "ראש השנה"
        else if (hday == 10)
            return "יום כיפור"
        else if (hday == 15)
            return "סוכות"
        else if (hday == 22)
            return "שמחת תורה"
    }
    else if (hmonth == 8) {
        if (hday == 15 || hday == 21)
            return "פסח"
    }
    else if (hmonth == 10) {
        if (hday == 6)
            return "שבועות"
    }
    return "";
}

function GetErevChag(gDate, hday, hmonth, hyear, dow) {
    if (hmonth == 13) {
        if (hday == 29)
            return "ערב ראש השנה"
    }
    if (hmonth == 1) {
        if (hday == 9)
            return "ערב יום כיפור"
        else if (hday == 14)
            return "ערב סוכות"
        else if (hday == 21)
            return "ערב שמחת תורה"
    }
    else if (hmonth == 8) {
        if (hday == 14)
            return "ערב פסח"
        else if (hday == 20)
            return "ערב שביעי של פסח"
    }
    else if (hmonth == 10) {
        if (hday == 5)
            return "ערב שבועות"
    }
    return "";
}



