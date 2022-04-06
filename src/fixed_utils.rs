static PREC_TABLE: [i64; 15] = [
    1i64,
    10i64,
    100i64,
    1000i64,
    10000i64,
    100000i64,
    1000000i64,
    10000000i64,
    100000000i64,
    1000000000i64,
    10000000000i64,
    100000000000i64,
    1000000000000i64,
    10000000000000i64,
    100000000000000i64,
];

enum SFState {
    Init,
    Integral,
    Fract
}

#[derive(Debug)]
pub enum ParseError {
    NaN
}

fn char2digit(c: char) -> u8 {
    c as u8 - '0' as u8
}

fn digit2char(d: u8) -> char {
    (d + '0' as u8) as char
}

fn is_digit(c: char) -> bool {
    c >= '0' && c <= '9'
}

fn is_whitespace(c: char) -> bool {
    c == ' ' || c == '\t'
}

fn is_dot(c: char) -> bool {
    c == '.' || c == ','
}

pub fn string2fixed(s: String, req_precision: Option<u32>, precision: &mut u32, norm_s: Option<&mut String>)
        -> Result<i64, ParseError> {
    let req_prec = req_precision.unwrap_or(0u32);
    *precision = 0u32;

    let mut norm_str = String::with_capacity(s.len());

    let mut res = 0i64;
    let mut neg = 1i64;
    let mut st = SFState::Init;
    let mut has_sign = false;
    for c in s.chars() {
        match st {
            SFState::Init => {
                if !has_sign && c == '-' {
                    neg = -1i64;
                    has_sign = true;

                    norm_str.push('-');
                } else if is_digit(c) {
                    res += neg * char2digit(c) as i64;
                    st = SFState::Integral;

                    norm_str.push(c);
                } else if is_dot(c) {
                    st = SFState::Fract;

                    norm_str.push('.');
                } else if !is_whitespace(c) {
                    return Err(ParseError::NaN);
                }
            },
            SFState::Integral => {
                if is_digit(c) {
                    res *= 10;
                    res += neg * char2digit(c) as i64;

                    norm_str.push(c);
                } else if is_dot(c) {
                    st = SFState::Fract;

                    norm_str.push('.');
                } else if !is_whitespace(c) {
                    return Err(ParseError::NaN);
                }
            },
            SFState::Fract => {
                if is_digit(c) {
                    *precision += 1;
                    if req_precision.is_some() && *precision > req_prec {
                        break;
                    }
                    res *= 10;
                    res += neg * char2digit(c) as i64;

                    norm_str.push(c);
                } else if !is_whitespace(c) && !is_dot(c) {
                    return Err(ParseError::NaN);
                }
            }
        }
    }
    if *precision < req_prec {
        res *= PREC_TABLE[(req_prec - *precision) as usize];
        *precision = req_prec;
    }
    if norm_s.is_some() {
        *(norm_s.unwrap()) = norm_str
    }
    return Ok(res)
}

pub fn fixed2string(mut fixed: i64, precision: u32, dec_places: Option<u32>) -> String {
    let neg = fixed < 0;
    let one: i64 = PREC_TABLE[precision as usize];
    let lesser1 = fixed / one == 0;
    if lesser1 {
        fixed += if neg { -one } else { one };
    }

    let mut s = String::with_capacity(10usize);
    let to_float = dec_places.is_none();
    let skip_places = precision - dec_places.unwrap_or(precision);
    let mut i = 0u32;
    let mut remain = fixed;
    while remain != 0 {
        if i < skip_places {
            remain /= 10;
            i += 1;
            continue;
        }

        if i == precision {
            if skip_places != precision && (!to_float || s.len() != 0) {
                s.insert(0, '.');
            }
            i += 1;
            continue;
        }

        let digit = (remain % 10).abs() as u8;
        remain /= 10;

        if lesser1 && remain == 0 {
            s.insert(0, '0');
        } else {
            let c = digit2char(digit);
            if !to_float || (i >= precision || c != '0' || s.len() != 0) {
                s.insert(0, c);
            }
        }
        i += 1;
    }

    if neg {
        s.insert(0, '-')
    }

    return s
}
