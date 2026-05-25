#include <mpi.h>
#include <stdio.h>

int main(int argc, char *argv[]) {

    int rank, size;
    int value, sum;

    // Initialize MPI
    MPI_Init(&argc, &argv);

    // Get process ID
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    // Get total processes
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Each process has its own value
    value = rank + 1;

    printf("Process %d has value %d\n", rank, value);

    // Collective computation (sum)
    MPI_Reduce(&value, &sum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

    // Root process prints result
    if(rank == 0) {
        printf("\nTotal Sum = %d\n", sum);
    }

    // Finalize MPI
    MPI_Finalize();

    return 0;
}