<template>
  <div></div>
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
      current: false,
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
    editGuardian(guardian){
      console.log(guardian);
      this.guardian = {...guardian};
      console.log(this.guardian);
      this.deleteGuardianDialog = true;
    },
    deleteGuardian(){
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
    exportToCSV(){
      this.$refs.dt.exportToCSV();
    },
    confirmDeleteSelected(){
      this.deleteGuardianDialog = true;
    },
    deleteSelectedGuardians(){
      this.selectedGuardians.forEach((guardian) => {
        this.guardiansService.delete(guardian.id).then((response) => {
          this.guardians= this.guardians.filter(
            (t) => t.id !== this.guardian.id
          );
          console.log(response);
        });
      });
      this.deleteGuardiansDialog= false;
    },
    initFilter(){
      this.filters = {
        global: {value:null, matchMode: FilterMatchMode.CONTAINS},
      }
    }
  },
};
</script>

<style scoped></style>
