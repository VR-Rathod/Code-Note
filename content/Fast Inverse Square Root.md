---
seoTitle: Fast Inverse Square Root – The Legendary Quake III Trick
description: "Discover the legendary fast inverse square root algorithm (0x5f3759df) from Quake III Arena for calculating 1/sqrt(x) without division."
keywords: "fast inverse square root, 0x5f3759df, quake 3 engine, john carmack, floating point bit hack, Newton-Raphson method, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is the Fast Inverse Square Root?
> The **Fast Inverse Square Root** is an algorithm that estimates $\frac{1}{\sqrt{x}}$ in $O(1)$ time. 
> Originally popularized by the source code of *Quake III Arena* (1999), it bypasses expensive floating-point division and square-root CPU instructions by manipulating the bit representation of floating-point numbers as if they were integers.

- # Explanation
  - In 3D graphics (like Quake III), calculating surface normals and reflections requires normalizing millions of 3D vectors per second. Vector normalization requires calculating $\frac{x}{\sqrt{x^2 + y^2 + z^2}}$. 
  - Standard floating-point division and square roots were extremely slow on 1990s CPUs. The Fast Inverse Square Root uses bit-shifting and a "magic number" (`0x5f3759df`) to create a remarkably accurate initial guess, followed by one iteration of Newton's method to refine it.

- # How It Works
  collapsed:: true
  - 1. **Bitwise Aliasing**: The float $x$ is treated directly as a 32-bit integer. Because of how IEEE 754 floats are structured (exponent and mantissa), bit-shifting this integer to the right (`>> 1`) mathematically approximates halving the exponent.
  - 2. **The Magic Number (`0x5f3759df`)**: Subtracting the halved integer from this specific magic constant roughly calculates $-\frac{1}{2}$ of the logarithm of $x$, yielding an incredibly accurate first guess for $\frac{1}{\sqrt{x}}$.
  - 3. **Newton-Raphson Iteration**: The bitwise trick yields a guess with about 1% error. One pass of the Newton-Raphson formula ($y = y \cdot (1.5 - (x2 \cdot y \cdot y))$) corrects this to within a 0.17% error margin, which is perfect for real-time graphics.

- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```c++
    #include <iostream>

    // The original Quake III Arena function (modified slightly for modern C++)
    float Q_rsqrt(float number) {
        long i;
        float x2, y;
        const float threehalfs = 1.5F;

        x2 = number * 0.5F;
        y  = number;
        
        // Evil floating point bit level hacking
        i  = * ( long * ) &y;                       
        
        // What the fuck? (The original comment from the source code)
        i  = 0x5f3759df - ( i >> 1 );               
        
        y  = * ( float * ) &i;
        
        // 1st iteration of Newton-Raphson method
        y  = y * ( threehalfs - ( x2 * y * y ) );   
        
        // 2nd iteration (usually removed for speed, 1st is accurate enough)
        // y  = y * ( threehalfs - ( x2 * y * y ) );   

        return y;
    }

    int main() {
        float x = 25.0f;
        std::cout << "1 / sqrt(25) = " << Q_rsqrt(x) << "\n"; // Output: ~0.2
        return 0;
    }
    ```
    :::

- # Key Takeaways
  - The algorithm relies on the IEEE 754 floating-point standard format to perform log-like operations using simple integer bit-shifts.
  - While modern CPUs have dedicated hardware instructions (like `rsqrtss` in SSE/AVX) that render this software hack obsolete, it remains one of the most famous examples of advanced, out-of-the-box optimization in computer science history.

- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Fast inverse square root](https://en.wikipedia.org/wiki/Fast_inverse_square_root)
