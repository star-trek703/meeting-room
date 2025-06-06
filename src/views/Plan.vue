<template>
    <div class="container">
        <h2>Subscription plans</h2>

        <div v-if="loading">Loading plans...</div>
        <p v-if="error" class="error">{{ error }}</p>

        <!-- Plans table -->
        <table v-if="plans.length" class="plan-table">
            <thead>
                <tr>
                    <th>Plan</th>
                    <th>Daily limit</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="plan in plans" :key="plan.id">
                    <td>{{ plan.name }}</td>
                    <td>{{ plan.daily_limit }}</td>
                    <td>${{ plan.amount }}</td>
                    <td>
                    <span v-if="plan.status === 'Active'">
                        Active
                    </span>
                    <button v-else @click="purchaseSubscription(plan.id)">
                        Purchase
                    </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- No plans -->
        <p v-else-if="!loading && !error">No plans found.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../utils/axios'

const plans = ref([])
const loading = ref(true)
const error = ref('')

async function getPlans() {
    loading.value = true
    error.value = ''

    try {
        const response = await axios.get('/plans')

        // plans.value = response.data.plans || []
        plans.value = response.data.plans.map(sub =>
            sub.id == response.data.user_plan.plan_id ? { ...sub, status: 'Active' } : { ...sub, status: 'Inactive' }
        )
    } catch (err) {
        console.error(err)
        error.value = err.response?.data?.message || 'Failed to load plans'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getPlans()
})

async function purchaseSubscription(id) {
    if (!confirm('Are you sure you want to purchase this plan?')) return

    try {
        await axios.post(`/subscriptions`, {plan_id: id})
        plans.value = plans.value.map(sub =>
            sub.id === id ? { ...sub, status: 'Active' } : { ...sub, status: 'Inactive' }
        )
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to purchase plan')
    }
}
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: auto;
    padding: 1rem;
}

.plan-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.plan-table th, .plan-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

.plan-table th {
    background-color: #f1f1f1;
}

button {
    padding: 6px 10px;
    background: #c00;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>
