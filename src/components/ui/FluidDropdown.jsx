import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ChevronDown, Coffee, Calendar, Zap, Flame, Clock } from "lucide-react"

// Utility function for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Custom hook for click outside detection
function useClickAway(ref, handler) {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

// Button component
const Button = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button" // prevent form submission
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "outline" && "border border-neutral-700 bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

// Icon wrapper with animation
const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}) => (
  <motion.div 
    className="w-5 h-5 mr-3 relative shrink-0 flex items-center justify-center" 
    initial={false} 
    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
  >
    <Icon className="w-5 h-5" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-5 h-5" strokeWidth={2.5} />
      </motion.div>
    )}
  </motion.div>
)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function FluidDropdown({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoveredCategory, setHoveredCategory] = React.useState(null)
  const dropdownRef = React.useRef(null)

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // Find the currently selected option object
  const selectedOption = options.find((opt) => opt.id === value)

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="w-full relative"
        ref={dropdownRef}
      >
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between bg-transparent",
            "hover:bg-charcoal/5 dark:hover:bg-[#F2F0E8]/5 text-charcoal dark:text-[#F2F0E8]",
            "transition-all duration-200 ease-in-out",
            "border-b-2 border-charcoal/15 dark:border-[#F2F0E8]/15 focus:border-brass rounded-none px-0",
            "h-14 font-medium text-base",
            isOpen && "border-brass"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            {selectedOption ? (
              <>
                <IconWrapper 
                  icon={selectedOption.icon} 
                  isHovered={false} 
                  color={selectedOption.color} 
                />
                {selectedOption.label}
              </>
            ) : (
              <span className="text-charcoal/50 dark:text-[#F2F0E8]/50 flex items-center">
                <IconWrapper 
                  icon={Clock} 
                  isHovered={false} 
                  color="#A06CD5" 
                />
                {placeholder}
              </span>
            )}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5 text-charcoal/50 dark:text-[#F2F0E8]/50"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className="w-full rounded-2xl border border-charcoal/10 dark:border-[#F2F0E8]/10 bg-paper dark:bg-[#1A1A1C] p-2 shadow-2xl backdrop-blur-xl"
                initial={{ borderRadius: 16 }}
                animate={{
                  borderRadius: 16,
                  transition: { duration: 0.2 },
                }}
                style={{ transformOrigin: "top" }}
              >
                <motion.div 
                  className="py-1 relative flex flex-col" 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  <motion.div
                    layoutId="hover-highlight"
                    className="absolute left-1 right-1 bg-charcoal/5 dark:bg-[#F2F0E8]/10 rounded-xl"
                    animate={{
                      y: options.findIndex((c) => (hoveredCategory || value || options[0].id) === c.id) * 52, // 52px height per item
                      height: 52,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                  {options.map((category, index) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        onChange(category.id)
                        setIsOpen(false)
                      }}
                      onHoverStart={() => setHoveredCategory(category.id)}
                      onHoverEnd={() => setHoveredCategory(null)}
                      className={cn(
                        "relative flex w-full items-center px-4 h-[52px] text-sm font-medium rounded-xl",
                        "transition-colors duration-150",
                        "focus:outline-none",
                        value === category.id || hoveredCategory === category.id
                          ? "text-charcoal dark:text-white"
                          : "text-charcoal/70 dark:text-[#F2F0E8]/70",
                      )}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <IconWrapper
                        icon={category.icon}
                        isHovered={hoveredCategory === category.id || value === category.id}
                        color={category.color}
                      />
                      {category.label}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
