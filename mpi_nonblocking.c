#include <mpi.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    int rank, size;
    int data;
    MPI_Request request;
    MPI_Status status;

    MPI_Init(&argc, &argv);

    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    if (rank == 0) {
        data = 50;
        printf("Process 0 sending data = %d\n", data);

        // Non-blocking send
        MPI_Isend(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &request);

        // Wait for send to complete
        MPI_Wait(&request, &status);
    }

    if (rank == 1) {
        // Non-blocking receive
        MPI_Irecv(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &request);

        // Wait for receive to complete
        MPI_Wait(&request, &status);

        printf("Process 1 received data = %d\n", data);
    }

    MPI_Finalize();
    return 0;
}