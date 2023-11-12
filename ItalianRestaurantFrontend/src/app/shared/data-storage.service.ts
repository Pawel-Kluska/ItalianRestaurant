import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Meal} from "../models/meal";
import {Subject} from "rxjs";
import {Delivery} from "../models/delivery";
import {OrderRes} from "../models/order";
import {environment} from "../../environments/environment";
import {MealResponse, MealsWithPagination} from "../models/MealResponse";
import {Table} from "../models/table";
import {MealDto} from "../models/mealDto";
import {PaymentResponse} from "../models/payment-response";
import {Cart} from "../models/cart";
import {Reservation} from "../models/reservation";

@Injectable()
export class DataStorageService {
  page = 0
  size = 3
  meals = new Subject<MealsWithPagination>();

  constructor(private http: HttpClient) {
  }

  getMeals() {
    return this.http
      .get<MealResponse>(
        `${environment.apiUrl}/meals?page=${this.page}&size=${this.size}`,
      )
      .subscribe(
        (res) => {
          var menu = res.content.map(meal => new Meal(meal.id, meal.name, meal.image, meal.description, meal.price, meal.mealCategory))
          this.meals.next({meals: menu, numOfPages: res.totalPages, currPage: res.number})
        }
      )
  }

  getMealsWithoutPagination() {
    return this.http
      .get<{ content: Meal[] }>(`${environment.apiUrl}/meals`)
  }

  addMeal(meal: MealDto, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('meal', JSON.stringify(meal));
    return this.http
      .post(`${environment.apiUrl}/meals/add`, formData)
  }

  editMeal(meal: MealDto, id: number, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('meal', JSON.stringify(meal));
    return this.http.put(`${environment.apiUrl}/meals/edit/${id}`, formData)
  }

  deleteMeal(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/meals/delete/${id}`)
  }

  addCategory(categoryName: string, img: File) {
    const formData = new FormData();
    formData.append('image', img);
    formData.append('meal_category', JSON.stringify({name: categoryName}));
    return this.http
      .post(`${environment.apiUrl}/meal-categories/add`, formData)
  }

  editCategory(categoryName: string, img: File, id: number) {
    const formData = new FormData();
    formData.append('image', img);
    formData.append('meal_category', JSON.stringify({name: categoryName}));
    return this.http
      .put(`${environment.apiUrl}/meal-categories/edit/${id}`, formData)
  }

  deleteCategory(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/meal-categories/delete/${id}`);
  }

  getCategories() {
    return this.http
      .get<{ name: string, image: string }[]>(`${environment.apiUrl}/meal-categories`)
  }

  makeAnOrder(cart: Cart, delivery?: Delivery) {
    return this.http
      .post<PaymentResponse>(`${environment.apiUrl}/order`,
        {
          delivery: delivery,
          tableNr: cart.table,
          mealOrders: cart.meals,
          orderStatus: "IN_PREPARATION"
        })
  }



  getOrders() {
    return this.http
      .get<OrderRes[]>(`${environment.apiUrl}/order/all`)
  }

  getUserOrders() {
    return this.http
      .get<OrderRes[]>(`${environment.apiUrl}/order/user`)
  }

  updateOrder(orderStatus: string, deliveryDate: string, orderId: number) {
    return this.http
      .post(`${environment.apiUrl}/order/change-status`, {
        orderStatus: orderStatus,
        deliveryDate: deliveryDate,
        orderId: orderId
      })
      .subscribe()
  }

  nextPage() {
    this.page++
    this.getMeals();
  }

  previousPage() {
    this.page--
    this.getMeals();
  }

  deleteOrder(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/order/${id}`)
  }

  getTables() {
    return this.http
      .get<Table[]>(`${environment.apiUrl}/tables`)
  }

  saveTable(table: Table) {
    return this.http
      .post<Table>(`${environment.apiUrl}/tables`, table)
  }

  deleteTable(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/tables/${id}`)
  }

  getReservedTables(){
    return this.http
      .get<Table[]>(`${environment.apiUrl}/reservations/reserved/all`)
  }

  makeReservation(reservation: Reservation){
    return this.http
      .post(`${environment.apiUrl}/reservations/add`, reservation)
  }

  getReservationsForTable(tableId: number, date: string){
    return this.http
      .get<string[]>(`${environment.apiUrl}/reservations/reserved?tableId=${tableId}&date=${date}`)
  }

  getUserReservations(){
    return this.http
      .get<Reservation[]>(`${environment.apiUrl}/reservations/user`)
  }

  cancelReservation(reservation: Reservation){
    return this.http
      .delete(`${environment.apiUrl}/reservations/cancel?reservationId=${reservation.id}`)
  }

  getLastDeliveryInfo(){
    return this.http
      .get<Delivery>(`${environment.apiUrl}/order/last`)
  }
}
