import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      offset={24}
      mobileOffset={96}
      toastOptions={{
        classNames: {
          toast:
            '!rounded-2xl !border !border-border !bg-card !text-card-foreground !shadow-xl !font-sans !text-sm',
          description: '!text-muted-foreground',
          actionButton:
            '!rounded-full !bg-primary !text-primary-foreground !font-semibold',
          cancelButton:
            '!rounded-full !bg-secondary !text-secondary-foreground',
          icon: '!text-gold',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
