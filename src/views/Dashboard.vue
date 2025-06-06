<template>
    <div class="container">
        <h2>My Bookings</h2>

        <div class="filters">
            <select v-model="type" @change="getBookings()">
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
            </select>
        </div>

        <div v-if="loading">Loading bookings...</div>
        <p v-if="error" class="error">{{ error }}</p>

        <!-- Bookings table -->
        <table v-if="bookings.length" class="booking-table">
            <thead>
            <tr>
                <th>Meeting</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Members</th>
                <th>Room</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
                <td>{{ booking.meeting_name }}</td>
                <td>{{ booking.start_time }}</td>
                <td>{{ booking.duration }} mins</td>
                <td>{{ booking.members }}</td>
                <td>{{ booking.room.name }} ({{ booking.room.capacity }})</td>
                <td>
                <button @click="deleteBooking(booking.id)">Cancel</button>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- No bookings -->
        <p v-else-if="!loading && !error">No bookings found.</p>

        <!-- Pagination -->
        <div class="pagination" v-if="pagination.last_page > 1">
            <button :disabled="pagination.current_page === 1" @click="getBookings(pagination.current_page - 1)">
            &larr;
            </button>

            <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

            <button :disabled="pagination.current_page === pagination.last_page"
                    @click="getBookings(pagination.current_page + 1)">
            &rarr;
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../utils/axios'

const bookings = ref([])
const loading = ref(true)
const error = ref('')
const type = ref('upcoming')

const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0
})

async function getBookings(page = 1) {
    loading.value = true
    error.value = ''

    try {
        const params = {
            params: {
                page, type: type.value
            }
        }
    
        const response = await axios.get('/bookings', params)

        bookings.value = response.data.bookings.data || []
        pagination.value = {
            current_page: response.data.bookings.current_page,
            last_page: response.data.bookings.last_page,
            total: response.data.bookings.total
        }
    } catch (err) {
        console.log(err)
        error.value = err.response?.data?.message || 'Failed to load bookings'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  getBookings()
})

async function deleteBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
        await axios.delete(`/bookings/${id}`)
        bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking')
    }
}
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: auto;
    padding: 1rem;
}

.filters {
    margin: 1rem 0;
}

.booking-table {
    width: 100%;
    border-collapse: collapse;
}

.booking-table th, .booking-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

.booking-table th {
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

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
}
</style>
