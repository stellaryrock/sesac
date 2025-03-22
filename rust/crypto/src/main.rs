mod point;

fn main() {
    println!("Elliptic Curve Cryptography Implementation");
    
    // Example usage of the Point class
    match point::Point::new(Some(-1), Some(-1), 5, 7) {
        Ok(p) => {
            println!("Created point: {}", p);
            
            // Demonstrate point addition
            if let Ok(p2) = point::Point::new(Some(2), Some(5), 5, 7) {
                // Clone p here to avoid moving it
                match p.clone() + p2 {
                    Ok(p3) => println!("Point addition result: {}", p3),
                    Err(e) => println!("Addition error: {}", e),
                }
            }
            
            // Demonstrate scalar multiplication
            match p * 3 {
                Ok(p_mul) => println!("Scalar multiplication result: {}", p_mul),
                Err(e) => println!("Multiplication error: {}", e),
            }
        },
        Err(e) => println!("Error creating point: {}", e),
    }

    
    
}
