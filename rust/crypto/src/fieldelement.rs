use std::ops::{Add, Sub, Mul, Div};
use std::fmt;

/// Represents an element in a finite field of prime order
#[derive(Debug, Clone, PartialEq)]
pub struct FieldElement {
    num: i64,
    prime: i64,
}

impl FieldElement {
    /// Creates a new field element
    pub fn new(num: i64, prime: i64) -> Result<Self, String> {
        if prime <= 1 {
            return Err("Prime must be greater than 1".to_string());
        }
        if num >= prime || num < 0 {
            return Err(format!("Num {} not in field range 0 to {}", num, prime - 1));
        }
        Ok(FieldElement { num, prime })
    }
}

impl fmt::Display for FieldElement {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "FieldElement_{}({})", self.prime, self.num)
    }
}

impl Add for FieldElement {
    type Output = Result<FieldElement, String>;
    
    fn add(self, other: FieldElement) -> Self::Output {
        if self.prime != other.prime {
            return Err("Cannot add two numbers in different Fields".to_string());
        }
        let num = (self.num + other.num) % self.prime;
        FieldElement::new(num, self.prime)
    }
}

impl Sub for FieldElement {
    type Output = Result<FieldElement, String>;
    
    fn sub(self, other: FieldElement) -> Self::Output {
        if self.prime != other.prime {
            return Err("Cannot subtract two numbers in different Fields".to_string());
        }

        let mut num = (self.num - other.num) % self.prime;

        if num < 0 {
            num += self.prime;
        }

        FieldElement::new(num, self.prime)
    }
}

impl Mul for FieldElement {
    type Output = Result<FieldElement, String>;
    
    fn mul(self, other: FieldElement) -> Self::Output {
        if self.prime != other.prime {
            return Err("Cannot multiply two numbers in different Fields".to_string());
        }

        let num = (self.num * other.num) % self.prime;
        
        FieldElement::new(num, self.prime)
    }
}

impl Div for FieldElement {
    type Output = Result<FieldElement, String>;
    
    fn div(self, other: FieldElement) -> Self::Output {
        if self.prime != other.prime {
            return Err("Cannot divide two numbers in different Fields".to_string());
        }
        
        // Fermat's little theorem states that a^(p-1) ≡ 1 (mod p)
        // Therefore, a^(p-2) is the multiplicative inverse of a
        let exp = self.prime - 2;
        let mut n = other.num;
        let result = 1;
        
        let pow = n.pow(exp.try_into().expect("Exponent too large for u32"));
        let result = pow % self.prime;
        
        let num = (self.num * result) % self.prime;
        
        FieldElement::new(num, self.prime)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_field_element_creation() {
        let fe = FieldElement::new(2, 7);
        assert!(fe.is_ok());
        
        let fe_invalid = FieldElement::new(7, 7);
        assert!(fe_invalid.is_err());
    }
    
    #[test]
    fn test_field_arithmetic() {
        let fe1 = FieldElement::new(3, 13).unwrap();
        let fe2 = FieldElement::new(7, 13).unwrap();
        
        let sum = (fe1.clone() + fe2.clone()).unwrap();
        assert_eq!(sum.num, 10);
        
        let diff = (fe1.clone() - fe2.clone()).unwrap();
        assert_eq!(diff.num, 9);
        
        let prod = (fe1.clone() * fe2.clone()).unwrap();
        assert_eq!(prod.num, 8);
        
        let quot = (fe1.clone() / fe2.clone()).unwrap();
        assert_eq!(quot.num, 6);
    }
}
