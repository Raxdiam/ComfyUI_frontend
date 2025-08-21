import { ref } from 'vue'

/**
 * Create a simple story render function with Composition API
 * Reduces template duplication and provides consistent patterns
 */
export function createStoryRender(
  componentName: string,
  setupFn?: (args: any) => Record<string, any>
) {
  return (args: any) => ({
    components: { [componentName]: args.__component },
    setup() {
      const actions = ref<string[]>([])

      const logAction = (action: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString()
        const message = data
          ? `${action}: ${JSON.stringify(data)} (${timestamp})`
          : `${action} (${timestamp})`
        actions.value.unshift(message)
        if (actions.value.length > 5) actions.value.pop()
        console.log(action, data)
      }

      // Custom setup function can override defaults
      const customSetup = setupFn?.(args) || {}

      return {
        args,
        actions,
        logAction,
        ...customSetup
      }
    },
    template: `
      <div style="padding: 20px;">
        <${componentName} v-bind="$attrs" v-on="$listeners" />
        <div v-if="actions.length > 0" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 12px;">
          <div style="font-weight: bold; margin-bottom: 8px;">Actions Log:</div>
          <div v-for="action in actions" :key="action" style="margin: 2px 0;">{{ action }}</div>
        </div>
      </div>
    `
  })
}

/**
 * Enhanced story render for v-model components
 */
export function createModelStoryRender(
  componentName: string,
  defaultValue: any = false,
  setupFn?: (args: any) => Record<string, any>
) {
  return (args: any) => ({
    components: { [componentName]: args.__component },
    setup() {
      const modelValue = ref(args.modelValue ?? defaultValue)
      const actions = ref<string[]>([])

      const logAction = (action: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString()
        const message = data
          ? `${action}: ${JSON.stringify(data)} (${timestamp})`
          : `${action} (${timestamp})`
        actions.value.unshift(message)
        if (actions.value.length > 5) actions.value.pop()
        console.log(action, data)
      }

      const updateModel = (value: any) => {
        modelValue.value = value
        logAction('model updated', value)
      }

      // Custom setup function can override defaults
      const customSetup = setupFn?.(args) || {}

      return {
        args,
        modelValue,
        actions,
        logAction,
        updateModel,
        ...customSetup
      }
    }
  })
}

/**
 * Story render with built-in async simulation
 */
export function createAsyncStoryRender(
  componentName: string,
  asyncDuration = 2000,
  setupFn?: (args: any) => Record<string, any>
) {
  return (args: any) => ({
    components: { [componentName]: args.__component },
    setup() {
      const isLoading = ref(args.modelValue ?? false)
      const actions = ref<string[]>([])

      const logAction = (action: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString()
        const message = data
          ? `${action}: ${JSON.stringify(data)} (${timestamp})`
          : `${action} (${timestamp})`
        actions.value.unshift(message)
        if (actions.value.length > 5) actions.value.pop()
        console.log(action, data)
      }

      const simulateAsync = async (actionName: string) => {
        logAction(`${actionName} started`)
        isLoading.value = true
        await new Promise((resolve) => setTimeout(resolve, asyncDuration))
        isLoading.value = false
        logAction(`${actionName} completed`)
      }

      // Custom setup function can override defaults
      const customSetup = setupFn?.(args) || {}

      return {
        args,
        isLoading,
        actions,
        logAction,
        simulateAsync,
        ...customSetup
      }
    }
  })
}
