import { computed, Injectable, signal } from '@angular/core';
import { CacheConfig } from '../../models/cache.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private caches = new Map<string, any>();
  private readonly DEFAULT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  createCache<T>(config: CacheConfig,
    fetchFunction: () => Observable<T[]>) {
      const { key, cacheDuration = this.DEFAULT_CACHE_DURATION } = config;

      if (this.caches.has(key)) {
        return this.caches.get(key);
      }

    const _data = signal<T[]>([]);
    const _loading = signal<boolean>(false);
    const _error = signal<string | null>(null);
    const _lastLoaded = signal<number | null>(null);

    const cache = {
      data: _data.asReadonly(),
      loading: _loading.asReadonly(),
      error: _error.asReadonly(),
      lastLoaded: _lastLoaded.asReadonly(),

      isEmpty: computed(() => _data().length === 0),
      isDataFresh: computed(() => {
        const lastLoaded = _lastLoaded();
        if (!lastLoaded) return false;
        return (Date.now() - lastLoaded) < cacheDuration;
      }),

      loadIfNeeded: (): void => {
        const lastLoaded = _lastLoaded();
        const now = Date.now();

        if(!lastLoaded || (now - lastLoaded) >= cacheDuration || _data().length === 0) {
          cache.load();
        }
      },

      load: (): void => {
        if (_loading()) return;

        _loading.set(true);
        _error.set(null);

        fetchFunction().subscribe({
          next: (data) => {
            _data.set(data);
            _lastLoaded.set(Date.now());
            console.log(`Cache [${key}] loaded with ${data.length} items.`);
            console.log(`Cache [${key}] data:`, data);
          },
          error: (err) => {
            console.error(`Cache [${key}] load error:`, err);
            _error.set(`Failed to load ${key} data.`);
          },
          complete: () => {
            _loading.set(false);
          }
        });
      },

      refresh: (): void => {
        _data.set([]);
        _lastLoaded.set(null);
        cache.load();
      },

      getData: () => _data.asReadonly(),
      findById: (id: any) => _data().find(item => { return (item as any)?.id === id }),
      filterBy: (predicate: (item: T) => boolean) => _data().filter(predicate),

      clear: (): void => {
        _data.set([]);
        _lastLoaded.set(null);
        _error.set(null);
      }
    };

    this.caches.set(key, cache);
    return cache;
  }

  getCache<T>(key: string) {
    return this.caches.get(key);
  }

  clearAllCaches(): void {
    this.caches.forEach((cache) => cache.clear());
    this.caches.clear();
  }

  clearCache(key: string): void {
    const cache = this.caches.get(key);
    if (cache) {
      cache.clear();
      this.caches.delete(key);
    }
  }

}
