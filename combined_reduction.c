#include <stdio.h>
#include <omp.h>

#define N 10

int main() {
    int i;
    int sum = 0;

    // Combined parallel + for + reduction
    #pragma omp parallel for reduction(+:sum)
    for (i = 1; i <= N; i++) {
        sum += i;
    }

    printf("Sum = %d\n", sum);
    return 0;
}
