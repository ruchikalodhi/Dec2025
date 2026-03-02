#include <stdio.h>
#include <omp.h>

#define N 1000

double A[N][N], B[N][N], C[N][N];

int main() {

    #pragma omp parallel for
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            C[i][j] = 0;
            for (int k = 0; k < N; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return 0;
}


//gcc matrixmul.c -fopenmp -o orphaned