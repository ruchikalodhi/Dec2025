#include <mpi.h>
#include <stdio.h>

int main(int argc, char *argv[]) {

    int rank, size;
    int send_data[4] = {10, 20, 30, 40};
    int recv_data;
    int gather_data[4];

    // Initialize MPI
    MPI_Init(&argc, &argv);

    // Get process ID
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    // Get total number of processes
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Scatter data from root process (0) to all processes
    MPI_Scatter(send_data, 1, MPI_INT, &recv_data, 1, MPI_INT, 0, MPI_COMM_WORLD);

    printf("Process %d received %d\n", rank, recv_data);

    // Each process modifies data
    recv_data = recv_data * 2;

    // Gather modified data back to root process
    MPI_Gather(&recv_data, 1, MPI_INT, gather_data, 1, MPI_INT, 0, MPI_COMM_WORLD);

    // Root process prints gathered result
    if(rank == 0) {
        printf("\nGathered Data:\n");
        for(int i=0; i<size; i++) {
            printf("%d ", gather_data[i]);
        }
        printf("\n");
    }

    // Finalize MPI
    MPI_Finalize();

    return 0;
}