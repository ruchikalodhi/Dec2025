#include <stdio.h>
#include <omp.h>

int main() {
    int i;

    // OpenMP loop work-sharing
    #pragma omp parallel for
    for (i = 0; i < 10; i++) {
        printf("Iteration %d executed by thread %d\n",
               i, omp_get_thread_num());
    }

    return 0;
}
