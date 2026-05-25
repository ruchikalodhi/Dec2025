#include <stdio.h>
#include <omp.h>

#define N 1000

int main() {
    int i;
    float A[N], B[N], C[N];

    // Initialize vectors
    for (i = 0; i < N; i++) {
        A[i] = i * 1.0;
        B[i] = i * 2.0;
    }

    // Parallel vector addition
    #pragma omp parallel for
    for (i = 0; i < N; i++) {
        C[i] = A[i] + B[i];
    }

    // Print first 5 results
    for (i = 0; i < 5; i++) {
        printf("C[%d] = %f\n", i, C[i]);
    }

    return 0;
}
