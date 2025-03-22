use std::ops::{Add, Mul, Neg};
use std::fmt;

/// Represents a point on an elliptic curve of the form y² = x³ + ax + b
#[derive(Debug, Clone, PartialEq)]
pub struct Point {
    pub x: Option<i64>,
    pub y: Option<i64>,
    pub a: i64,
    pub b: i64,
}

impl Point {
    /// Creates a new point on the curve y² = x³ + ax + b
    pub fn new(x: Option<i64>, y: Option<i64>, a: i64, b: i64) -> Result<Self, String> {
        // The point at infinity is always valid
        if x.is_none() && y.is_none() {
            return Ok(Point { x, y, a, b });
        }
        
        // For regular points, 
        // check if they satisfy the curve equation
        if let (Some(x_val), Some(y_val)) = (x, y) {
            let left_side = y_val.pow(2);
            let right_side = x_val.pow(3) + a * x_val + b;
            
            if left_side == right_side {
                Ok(Point { x, y, a, b })
            } else {
                Err(format!("Point ({}, {}) is not on the curve y² = x³ + {}x + {}", 
                           x_val, y_val, a, b))
            }
        } else {
            Err("Both x and y must be Some or None".to_string())
        }
    }
    
    /// Returns true if this is the point at infinity (the identity element)
    pub fn is_infinity(&self) -> bool {
        self.x.is_none() && self.y.is_none()
    }
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match (self.x, self.y) {
            (None, None) => write!(f, "Point(infinity)"),
            (Some(x), Some(y)) => write!(f, "Point({}, {})_{}_{}", x, y, self.a, self.b),
            _ => write!(f, "Point(invalid)"),
        }
    }
}

impl Add for Point {
    type Output = Result<Point, String>;
    
    fn add(self, other: Point) -> Self::Output {
        // Points must be on the same curve
        if self.a != other.a || self.b != other.b {
            return Err("Points are not on the same curve".to_string());
        }
        
        // Case 0: self is the point at infinity (identity element)
        if self.is_infinity() {
            return Ok(other);
        }
        
        // Case 1: other is the point at infinity (identity element)
        if other.is_infinity() {
            return Ok(self);
        }
        
        // Unwrap x and y values (we know they're Some because neither point is at infinity)
        let x1 = self.x.unwrap();
        let y1 = self.y.unwrap();
        let x2 = other.x.unwrap();
        let y2 = other.y.unwrap();
        
        // Case 2: self and other have the same x but opposite y values
        // This represents the case where the points are inverses of each other
        if x1 == x2 && y1 == -y2 {
            return Point::new(None, None, self.a, self.b);
        }
        
        // Case 3: self and other are different points
        if x1 != x2 {
            let slope = (y2 - y1) as f64 / (x2 - x1) as f64;
            
            let x3 = (slope.powi(2) - x1 as f64 - x2 as f64).round() as i64;
            
            let y3 = (slope * (x1 as f64 - x3 as f64) - y1 as f64).round() as i64;
            
            return Point::new(Some(x3), Some(y3), self.a, self.b);
        }
        
        // Case 4: self and other are the same point
        if self == other {
            if y1 == 0 {
                return Point::new(None, None, self.a, self.b);
            }
            
            let slope = (3.0 * (x1.pow(2) as f64) + self.a as f64) / (2.0 * y1 as f64);

            let x3 = (slope.powi(2) - 2.0 * x1 as f64).round() as i64;
            
            let y3 = (slope * (x1 as f64 - x3 as f64) - y1 as f64).round() as i64;
            
            return Point::new(Some(x3), Some(y3), self.a, self.b);
        }
        
        Err("Unexpected case in point addition".to_string())
    }
}

impl Neg for Point {
    type Output = Point;
    
    fn neg(self) -> Self::Output {
        match (self.x, self.y) {
            (None, None) => self,  // Point at infinity is its own inverse
            (Some(x), Some(y)) => Point { x: Some(x), y: Some(-y), a: self.a, b: self.b },
            _ => panic!("Invalid point"),
        }
    }
}

// Scalar multiplication implementation (using the double-and-add algorithm)
impl Mul<i64> for Point {
    type Output = Result<Point, String>;
    
    fn mul(self, scalar: i64) -> Self::Output {
        if scalar < 0 {
            return (-self) * (-scalar);
        }
        
        if scalar == 0 {
            return Point::new(None, None, self.a, self.b);
        }
        
        let mut result = Point::new(None, None, self.a, self.b)?;
        let mut current = self.clone();
        let mut n = scalar;
        
        while n > 0 {
            if n & 1 == 1 {
                result = (result + current.clone())?;
            }
            current = (current.clone() + current)?;
            n >>= 1;
        }
        
        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_point_creation() {
        // Point on the curve y² = x³ + 5x + 7
        let p1 = Point::new(Some(-1), Some(1), 5, 7);
        assert!(p1.is_ok());
        
        // Point not on the curve
        let p2 = Point::new(Some(2), Some(4), 5, 7);
        assert!(p2.is_err());
        
        // Point at infinity
        let p3 = Point::new(None, None, 5, 7);
        assert!(p3.is_ok());
    }
    
    #[test]
    fn test_point_addition() {
        // Create points on the curve y² = x³ + 5x + 7
        let p1 = Point::new(Some(-1), Some(1), 5, 7).unwrap();
        let p2 = Point::new(Some(2), Some(5), 5, 7).unwrap();
        
        // Test addition
        let p3 = (p1.clone() + p2.clone()).unwrap();
        assert_eq!(p3.x, Some(3));
        assert_eq!(p3.y, Some(-7));
        
        // Test addition with point at infinity
        let inf = Point::new(None, None, 5, 7).unwrap();
        let p4 = (p1.clone() + inf.clone()).unwrap();
        assert_eq!(p4, p1);
        
        // Test doubling a point
        let p5 = (p1.clone() + p1.clone()).unwrap();
        // Verify the result (actual values would depend on the curve)
        assert!(p5.x.is_some() && p5.y.is_some());
    }
    
    #[test]
    fn test_scalar_multiplication() {
        let p = Point::new(Some(-1), Some(1), 5, 7).unwrap();
        
        // Test multiplication by 0
        let p0 = (p.clone() * 0).unwrap();
        assert!(p0.is_infinity());
        
        // Test multiplication by 1
        let p1 = (p.clone() * 1).unwrap();
        assert_eq!(p1, p);
        
        // Test multiplication by 2 (same as doubling)
        let p2 = (p.clone() * 2).unwrap();
        let p2_alt = (p.clone() + p.clone()).unwrap();
        assert_eq!(p2, p2_alt);
    }
} 