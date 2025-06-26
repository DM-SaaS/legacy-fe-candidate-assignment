import { render, screen } from '@testing-library/react'
import { Button } from '../ui/Button'

describe('Button', () => {
    it('renders button with text', () => {
        render(<Button>Test Button</Button>)

        const button = screen.getByRole('button', { name: /test button/i })
        expect(button).toBeInTheDocument()
    })

    it('applies default variant classes', () => {
        render(<Button>Default Button</Button>)

        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-primary')
    })

    it('applies outline variant classes', () => {
        render(<Button variant="outline">Outline Button</Button>)

        const button = screen.getByRole('button')
        expect(button).toHaveClass('border')
        expect(button).toHaveClass('border-input')
    })

    it('handles disabled state', () => {
        render(<Button disabled>Disabled Button</Button>)

        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button).toHaveClass('disabled:pointer-events-none')
    })
}) 