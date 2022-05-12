<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button
            label="New"
            icon="pi pi-plus"
            class="p-button-success mr-2"
            @click="openNew"
          />
          <pv-button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedUrgencies || !selectedUrgencies.length"
          />
        </template>
        <template #end>
          <pv-button
            label="Export"
            icon="pi pi-download"
            class="p-button-help"
            @click="exportToCSV"
          />
        </template>
      </pv-toolbar>
      <pv-data-table
        ref="dt"
        :value="urgencies"
        v-model:selection="selectedUrgencies"
        datakey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} guardians"
        responsiveLayout="scroll"
      >
        <template #header>
          <div
            class="table-header flex flex-column md:flex-row md:justify-content-between"
          >
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Urgencies</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <pv-input-text
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </template>

        <pv-column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <pv-column
          field="id"
          header="id"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="title"
          header="Title"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="summary"
          header="Summary"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="latitude"
          header="Latitude"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="longitude"
          header="Longitude"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="reportedAt"
          header="Report At"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="guardianId"
          header="Guardian id"
          :sortable="true"
          style="min-width: 12rem"
        />

      </pv-data-table>
    </div>
  </div>
</template>

<script>
import { UrgenciesApiService } from "../services/urgencies-api.service";
import { FilterMatchMode } from "primevue/api";

export default {
  name: "urgency-list",
  data() {
    return {
      urgencies: [],
      urgencyDialog: false,
      deleteUrgencyDialog: false,
      deleteUrgenciesDialog: false,
      urgency: {},
      selectedUrgencies: null,
      filters: {},
      submitted: false,
      urgenciesService: null,
    };
  },
  created() {
    this.urgenciesService = new UrgenciesApiService();
    this.urgenciesService.getAll().then((response) => {
      this.urgencies = response.data;
      console.log("created");
    });
    this.initFilter();
  },
  methods: {
    confirmDeleteUrgency(urgency) {
      this.urgency = urgency;
      this.deleteUrgencyDialog = true;
    },
    openNew() {
      this.urgency = {};
      this.submitted = false;
      this.urgencyDialog = true;
    },
    hideDialog() {
      this.urgencyDialog = false;
      this.submitted = false;
    },
    findIndexById(id) {
      return this.urgencies.findIndex((urgency) => urgency.id === id);
    },
    saveUrgency() {
      this.submitted = true;
      if (this.urgency.title.trim()) {
        if (this.urgency.id) {
          this.urgenciesService
            .update(this.urgency.id, this.urgency)
            .then((response) => {
              this.urgencies[this.findIndexById(response.data.id)] =
                this.urgency;
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Urgency Updated",
                life: 3000,
              });
              console.log(response);
            });
        } else {
          this.urgency.id = 0;
          console.log(this.urgency);
          this.urgenciesService.created(this.urgency).then((response) => {
            this.urgency = response.data;
            this.urgencies.push(this.urgency);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Urgency Created",
              life: 3000,
            });
            console.log(response);
          });
        }
        this.urgencyDialog = false;
        this.urgency = {};
      }
    },
    editUrgency(urgency) {
      console.log(urgency);
      this.urgency = { ...urgency };
      console.log(this.urgency);
      this.deleteUrgencyDialog = true;
    },
    deleteUrgency() {
      this.urgenciesService.delete(this.urgency.id).then((response) => {
        this.urgencies = this.urgencies.filter((t) => t.id !== this.urgency.id);
        this.deleteUrgencyDialog = false;
        this.urgency = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Urgency Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },
    exportToCSV() {
      this.$refs.dt.exportToCSV();
    },
    confirmDeleteSelected() {
      this.deleteUrgencyDialog = true;
    },
    deleteSelectedUrgencies() {
      this.selectedUrgencies.forEach((urgency) => {
        this.urgenciesService.delete(urgency.id).then((response) => {
          this.urgencies = this.urgencies.filter(
            (t) => t.id !== this.urgency.id
          );
          console.log(response);
        });
      });
      this.deleteUrgenciesDialog = false;
    },
    initFilter() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style scoped></style>

<style scoped></style>
