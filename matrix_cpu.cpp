
#include <iostream>
#include <vector>
#include <omp.h>

using namespace std;

int main() {
    int N = 2000;   // Large-scale matrix (change as needed)

    vector<double> A(N*N, 1.0);
    vector<double> B(N*N, 1.0);
    vector<double> C(N*N, 0.0);

    double start = omp_get_wtime();

    // Parallel matrix multiplication
    #pragma omp parallel for collapse(2)
    for(int i = 0; i < N; i++) {
        for(int j = 0; j < N; j++) {
            double sum = 0.0;
            for(int k = 0; k < N; k++) {
                sum += A[i*N + k] * B[k*N + j];
            }
            C[i*N + j] = sum;
        }
    }

    double end = omp_get_wtime();

    cout << "CPU OpenMP Time: " << end - start << " seconds\n";
    return 0;
}