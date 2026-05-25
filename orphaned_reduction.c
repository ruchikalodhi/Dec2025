#include <stdio.h>
#include <omp.h>

#define N 10

int sum = 0;   // shared variable

void calculate_sum() {
    int i;

    // Orphaned loop (no reduction here)
    #pragma omp for
    for (i = 1; i <= N; i++) {
        sum += i;
    }
}

int main() {

    // Reduction applied in enclosing parallel region
    #pragma omp parallel reduction(+:sum)
    {
        calculate_sum();
    }

    printf("Sum = %d\n", sum);
    return 0;
}
