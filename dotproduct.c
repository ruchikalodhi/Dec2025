#include <stdio.h>
#include <omp.h>

#define N 1000

int main() {
    int i;
    float A[N], B[N];
    float dot = 0.0;

    // Initialize vectors
    for (i = 0; i < N; i++) {
        A[i] = i * 1.0;
        B[i] = i * 2.0;
    }

    // Parallel dot product with reduction
    #pragma omp parallel for reduction(+:dot)
    for (i = 0; i < N; i++) {
        dot += A[i] * B[i];
    }

    printf("Dot Product = %f\n", dot);

    return 0;
}
