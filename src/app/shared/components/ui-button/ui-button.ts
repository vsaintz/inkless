import { Component, computed, input } from "@angular/core"

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.html',
  styles: ``,
})
export class UiButton {

  variant = input<'labelOnly' | 'withLeftIcon' | 'withRightIcon' | 'ghost'>('labelOnly')
  iconOnly = input<boolean>(false)

  buttonClasses = computed(() => {
    const layout = 'inline-flex items-center justify-center gap-2 transition duriation'
    const padding = this.iconOnly() ? 'p-2' : 'px-4 py-2'

    let colors = ''
    switch (this.variant()) {
      case 'withLeftIcon':
        colors = 'w-full bg-black text-white py-2 rounded-md font-medium cursor-pointer'
        break
      case 'withRightIcon':
        colors = 'w-full bg-black text-white py-2 rounded-md font-medium cursor-pointer';
        break
      case 'ghost':
        colors = 'w-full text-black p-5 bg-transparent border border-border rounded-md'
        break
      default:
        colors = 'w-full bg-black text-white py-2 rounded-md font-medium cursor-pointer'
        break
    }
    return `${layout} ${padding} ${colors}`
  })
}
