// src/utils/LRUCache.ts

export class LRUCache<K, V> {
    private cache: Map<K, V>;
    private capacity: number;
  
    constructor(capacity: number) {
      this.cache = new Map();
      this.capacity = capacity;
    }
  
    get(key: K): V | undefined {
      if (!this.cache.has(key)) {
        return undefined;
      }
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
  
    put(key: K, value: V): void {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
      if (this.cache.size === this.capacity) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
    }
  }
  