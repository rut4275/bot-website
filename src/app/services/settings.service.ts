color-color>
+  console.log("hello");
+}

import { from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { map } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: null };
    this._settings = new BehaviorSubject<AppSettings>(null);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(this.handleError<AppSettings>('loadSettings'))
      )
      .subscribe(
        data => {
          this.dataStore.settings = data;
          this._settings.next(Object.assign({}, this.dataStore).settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          this.dataStore.settings = data;
          this._settings.next(Object.assign({}, this.dataStore).settings);
        },
        error => console.log('Could not update settings.')
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from server first, fallback to localStorage
    this.http.get<AppSettings>('/api/settings')
      .pipe(
        catchError(() => {
          // If server request fails, use localStorage data
          return of(this.dataStore.settings);
        })
      )
      .subscribe(
        data => {
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => console.log('Could not load settings.')
      );
  }

  updateSettings(settings: AppSettings): void {
    // Save to localStorage immediately
    settings.saveToLocalStorage();
    this.dataStore.settings = settings;
    this._settings.next(this.dataStore.settings);

    // Try to save to server
    this.http.put<AppSettings>('/api/settings', settings)
      .pipe(
        catchError(this.handleError<AppSettings>('updateSettings'))
      )
      .subscribe(
        data => {
          // Server save successful, update with server response
          this.dataStore.settings = new AppSettings(data);
          this.dataStore.settings.saveToLocalStorage();
          this._settings.next(this.dataStore.settings);
        },
        error => {
          console.log('Could not save settings to server, but saved locally.');
        }
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

export interface AppSettings {
  openaiApiKey: string;
}

export class AppSettings {
  openaiApiKey: string = '';

  constructor(data?: any) {
    if (data) {
      this.openaiApiKey = data.openaiApiKey || '';
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('appSettings', JSON.stringify(this));
  }

  static loadFromLocalStorage(): AppSettings {
    const data = localStorage.getItem('appSettings');
    if (data) {
      try {
        return new AppSettings(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return new AppSettings();
  }
}

@Injectable()
export class AppSettingsService {
  private _settings: BehaviorSubject<AppSettings>;
  private dataStore: {
    settings: AppSettings;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { settings: AppSettings.loadFromLocalStorage() };
    this._settings = new BehaviorSubject<AppSettings>(this.dataStore.settings);
  }

  get settings(): Observable<AppSettings> {
    return this._settings.asObservable();
  }

  loadSettings(): void {
    // Try to load from