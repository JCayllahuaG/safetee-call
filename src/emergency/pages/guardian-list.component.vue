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
            @click="confirmDeleteGuardian()"
            :disabled="!selectedGuardians || !selectedGuardians.length"
          />
          <pv-dialog
            header="Confirmation"
            v-model:visible="guardianDialog"
            :style="{ width: '350px' }"
            :modal="true"
          >
            <div class="confirmation-content">
              <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
              />
              <span>Are you sure you want to proceed?</span>
            </div>
            <template #footer>
              <pv-button
                label="No"
                icon="pi pi-times"
                @click="hideDialog"
                class="p-button-text"
              />
              <pv-button
                label="Yes"
                icon="pi pi-check"
                @click="hideDialog"
                class="p-button-text"
                autofocus
              />
            </template>

          </pv-dialog>
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
        :value="guardians"
        v-model:selection="selectedGuardians"
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
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Guardians, {{current}}</h5>
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
          field="username"
          header="Username"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="email"
          header="Email"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="firstName"
          header="First Name"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="lastName"
          header="Last Name"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="email"
          header="Email"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="gender"
          header="Gender"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column
          field="address"
          header="Address"
          :sortable="true"
          style="min-width: 12rem"
        />
        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button
              icon="pi pi-user"
              class="p-button-text p-button-rounded"
              @click="makeCurrent(slotProps.data)"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<script>
import { GuardiansApiService } from "../services/guardians-api.service";
import { FilterMatchMode } from "primevue/api";

export default {
  name: "guardian-list",
  data() {
    return {
      guardians: [],
      guardianDialog: false,
      current: {},
      deleteGuardianDialog: false,
      deleteGuardiansDialog: false,
      guardian: {},
      selectedGuardians: null,
      filters: {},
      submitted: false,
      guardiansService: null,
    };
  },
  created() {
    this.guardiansService = new GuardiansApiService();
    this.guardiansService.getAll().then((response) => {
      this.guardians = response.data;
      console.log("created");
    });
    this.initFilter();
  },
  methods: {
    confirmDeleteGuardian(guardian) {
      this.guardian = guardian;
      this.deleteGuardianDialog = true;
    },
    makeCurrent(guardian) {
      this.guardiansService.getById(guardian.id).then((response) => {
        this.current = response.data.username;
      });
    },
    openNew() {
      this.guardian = {};
      this.submitted = false;
      this.guardianDialog = true;
    },
    hideDialog() {
      this.guardianDialog = false;
      this.submitted = false;
    },
    findIndexById(id) {
      return this.guardians.findIndex((guardian) => guardian.id === id);
    },
    saveGuardian() {
      this.submitted = true;
      if (this.guardian.username.trim()) {
        if (this.guardian.id) {
          this.guardiansService
            .update(this.guardian.id, this.guardian)
            .then((response) => {
              this.guardians[this.findIndexById(response.data.id)] =
                this.guardian;
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Guardian Updated",
                life: 3000,
              });
              console.log(response);
            });
        } else {
          this.guardian.id = 0;
          console.log(this.guardian);
          this.guardiansService.created(this.guardian).then((response) => {
            this.guardian = response.data;
            this.guardians.push(this.guardian);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Guardian Created",
              life: 3000,
            });
            console.log(response);
          });
        }
        this.guardianDialog = false;
        this.guardian = {};
      }
    },
    editGuardian(guardian) {
      console.log(guardian);
      this.guardian = { ...guardian };
      console.log(this.guardian);
      this.deleteGuardianDialog = true;
    },
    deleteGuardian() {
      this.guardiansService.delete(this.guardian.id).then((response) => {
        this.guardians = this.guardians.filter(
          (t) => t.id !== this.guardian.id
        );
        this.deleteGuardianDialog = false;
        this.guardian = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Guardian Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },
    exportToCSV() {
      this.$refs.dt.exportToCSV();
    },
    confirmDeleteSelected() {
      this.deleteGuardianDialog = true;
    },
    deleteSelectedGuardians() {
      this.selectedGuardians.forEach((guardian) => {
        this.guardiansService.delete(guardian.id).then((response) => {
          this.guardians = this.guardians.filter(
            (t) => t.id !== this.guardian.id
          );
          console.log(response);
        });
      });
      this.deleteGuardiansDialog = false;
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
