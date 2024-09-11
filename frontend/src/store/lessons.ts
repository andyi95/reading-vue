import {ref} from 'vue';
import {defineStore} from "pinia";
import { api } from '@/helpers';
import {AxiosError} from "axios";

export const useLessonStore = defineStore('lessonStore', () => {
    const lessons = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const mockLessons = [
  {
    "id": 1,
    "levels": [
      {
        "id": 2,
        "created_at": "2024-09-06T09:55:42.309435+03:00",
        "updated_at": "2024-09-06T10:38:05.245153+03:00",
        "title": "Главный ряд",
        "content": "фы фы фы ва ва ва ол ол ол дж дж дж\r\nфыва,оледж фы фы ол ва ва дж дж",
        "lesson": 1
      },
      {
        "id": 3,
        "created_at": "2024-09-06T09:55:42.309435+03:00",
        "updated_at": "2024-09-06T10:38:05.246153+03:00",
        "title": "Новые клавиши",
        "content": "фы ол дж ва фы дж ол ва\r\nВа фы дж ол ва фы ол дж",
        "lesson": 1
      },
      {
        "id": 4,
        "created_at": "2024-09-06T10:38:05.246153+03:00",
        "updated_at": "2024-09-06T10:38:05.246153+03:00",
        "title": "Клавиши 1",
        "content": "Фы ва ол дж фы ва дж ол\r\nОл фы дж ва ол ва фы дж",
        "lesson": 1
      },
      {
        "id": 5,
        "created_at": "2024-09-06T10:38:05.246153+03:00",
        "updated_at": "2024-09-06T10:38:05.246153+03:00",
        "title": "Клавиши 2",
        "content": "Фы ол дж ва фы ва ол дж фы\r\nОл ва фы дж ол ва фы дж ва",
        "lesson": 1
      }
    ],
    "created_at": "2024-09-02T10:01:13.331148+03:00",
    "updated_at": "2024-09-06T10:38:05.245153+03:00",
    "title": "Урок 1",
    "description": ""
  },
  {
    "id": 2,
    "levels": [
      {
        "id": 1,
        "created_at": "2024-09-02T10:34:30.362122+03:00",
        "updated_at": "2024-09-06T10:45:12.165515+03:00",
        "title": "Уровень 1",
        "content": "лал лал ада ада оао оао ажа ажа алаа",
        "lesson": 2
      }
    ],
    "created_at": "2024-09-02T10:34:30.362122+03:00",
    "updated_at": "2024-09-06T10:45:12.165515+03:00",
    "title": "Урок 2",
    "description": ""
  }
]
    async function fetchLessons() {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get('lessons/');
            lessons.value = response.data;
        }
        catch (err: any){
            error.value = err.message;
            lessons.value = mockLessons;
        }
        finally {
            loading.value = false;
        }
    }
    return {
        lessons,
        loading,
        error,
        fetchLessons
    }
})