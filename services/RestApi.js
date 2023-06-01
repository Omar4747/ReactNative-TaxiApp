import axios from 'axios'
import { Base_Url } from '../constants/url'

export default class RestApi {
  instance = null

  constructor() {
    this.instance = axios.create({
      baseURL: Base_Url,
      timeout: 50000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

    static getInstance() {
        if (this.instance == null) {
          this.instance = axios.create({
            baseURL: Base_Url,
            timeout: 50000,
            maxBodyLength: Infinity,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
        }
        return this.instance
      }
}
