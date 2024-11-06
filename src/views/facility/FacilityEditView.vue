<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">就醫資訊管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">編輯醫療機構</li>
            </ol>
          </nav>
        </div>

        <div class="row" id="cancel-row">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
            <div class="widget-content widget-content-area br-8">
              <form @submit.prevent="saveFacility">
                <div class="row m-3">
                  <div class="col-sm-6 my-2">
                    <label for="code" class="form-label">機構代碼</label>
                    <input type="text" class="form-control" v-model="facility.code" id="code" required>
                  </div>
                  <div class="col-sm-6 my-2">
                    <label for="name" class="form-label">機構名稱</label>
                    <input type="text" class="form-control" v-model="facility.name" id="name" required>
                  </div>
                  <div class="col-sm-6 my-2">
                    <label for="type" class="form-label">機構類型</label>
                    <input type="text" class="form-control" v-model="facility.type" id="type" required>
                  </div>
                  <div class="col-sm-6 my-2">
                    <label for="phone" class="form-label">電話</label>
                    <input type="text" class="form-control" v-model="facility.phone" id="phone" required>
                  </div>
                  <div class="col-sm-6 my-2">
                    <label for="address" class="form-label">地址</label>
                    <input type="text" class="form-control" v-model="facility.address" id="address" required>
                  </div>
                  <div class="col-sm-3 my-2 mt-5">
                    <label for="isChildCare" class="form-label">幼兒專責機構</label>
                    <input type="checkbox" v-model="facility.isChildCare" id="isChildCare">
                  </div>
                  <div class="col-sm-3 my-2 mt-5">
                    <label for="isFluoride" class="form-label">塗氟診所</label>
                    <input type="checkbox" v-model="facility.isFluoride" id="isFluoride">
                  </div>
                </div>

                <hr class="my-5">

                <div class="row m-3">
                  <div class="col-12">
                    <label class="form-label">服務時間</label>
                    <table class="table">
                      <thead>
                      <tr>
                        <th>星期</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                        <th>日</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(period, periodIndex) in servicePeriods" :key="period">
                        <td>{{ period }}</td>
                        <td v-for="(day, dayIndex) in 7" :key="dayIndex">
                          <input type="checkbox" v-model="serviceTimes[periodIndex][dayIndex]">
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="row m-3">
                  <div class="col-12">
                    <label for="notes" class="form-label">備註</label>
                    <textarea class="form-control" v-model="facility.notes" id="notes" rows="4"></textarea>
                  </div>
                </div>

                <div class="row m-3">
                  <div class="col-12 d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" @click="goBack">返回</button>
                    <button type="submit" class="btn btn-primary">保存</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FooterComponent from '@/components/layout/Footer.vue';
import apiClient from '@/utils/axios';
import Swal from 'sweetalert2';

interface Facility {
  id: string;
  code: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  notes: string | null;
  isChildCare: boolean;
  isFluoride: boolean;
  serviceInfo?: {
    srv_Time: Array<Array<{ yn: string; tagw: string; urlYN: string; hospName: string }>>;
    srv_Memo: string | null;
    [key: string]: unknown; // To allow other fields
  };
}

export default defineComponent({
  name: 'FacilityEditView',
  components: {
    FooterComponent
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const facility = ref<Facility>({
      id: '',
      code: '',
      name: '',
      type: '',
      phone: '',
      address: '',
      notes: null,
      isChildCare: false,
      isFluoride: false
    });
    const loading = ref(false);

    const servicePeriods = ['上午', '下午', '晚上'];
    const serviceTimes = ref<boolean[][]>([
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false]
    ]);

    const fetchFacilityData = async (id: string) => {
      loading.value = true;
      try {
        const response = await apiClient.get(`/facility/${id}`);
        facility.value = response.data;

        // Initialize serviceTimes based on fetched data
        if (facility.value.serviceInfo && facility.value.serviceInfo.srv_Time) {
          serviceTimes.value = facility.value.serviceInfo.srv_Time.map((period: any) =>
            period.map((day: any) => day.yn === 'N')
          );
        }

        // Initialize notes based on fetched data
        if (facility.value.serviceInfo && facility.value.serviceInfo.srv_Memo) {
          facility.value.notes = facility.value.serviceInfo.srv_Memo;
        }
      } catch (error) {
        console.error('Error fetching facility data:', error);
      } finally {
        loading.value = false;
      }
    };

    const saveFacility = async () => {
      loading.value = true;
      try {
        const { id, notes, serviceInfo, ...facilityData } = facility.value;
        const updatedServiceInfo = {
          ...serviceInfo,
          srv_Time: serviceTimes.value.map(period =>
            period.map(day => ({
              yn: day ? 'N' : 'Y',
              tagw: '',
              urlYN: 'X',
              hospName: ''
            }))
          ),
          srv_Memo: notes
        };
        await apiClient.patch(`/facility/${id}`, {
          ...facilityData,
          serviceInfo: updatedServiceInfo
        });
        Swal.fire('成功', '資料更新完成', 'success');
      } catch (error) {
        console.error('Error saving facility data:', error);
        Swal.fire('錯誤', '資料更新失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push('/facilityList');
    };

    onMounted(() => {
      const id = route.params.id as string;
      fetchFacilityData(id);
    });

    return {
      facility,
      servicePeriods,
      serviceTimes,
      saveFacility,
      goBack,
      loading
    };
  }
});
</script>

<style scoped>
.main-content {
  padding-left: 250px; /* Adjust this value based on your sidebar width */
  margin-top: 60px; /* Adjust this value based on your header height */
}

@media (max-width: 768px) {
  .main-content {
    padding-left: 0; /* Remove padding on smaller screens */
    margin-top: 20px; /* Adjust this value for smaller screens */
  }
}

.mt-4 {
  margin-top: 1.5rem; /* Add margin-top to create space above the checkboxes */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 保證 Loading 層在最上層 */
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
