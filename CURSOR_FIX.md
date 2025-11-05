# Custom Cursor Visibility Fix

## Issue
The custom cursor was sometimes becoming invisible when scrolling on the website.

## Root Cause
The cursor visibility was only triggered by `mousemove` events. When users scroll (especially with mouse wheel or trackpad), `mousemove` events don't fire, causing the cursor to disappear.

## Solution

### Changes Made to `components/CustomCursor.tsx`:

#### 1. **Initial Visibility State**
```typescript
// Before:
const [isVisible, setIsVisible] = useState(false)

// After:
const [isVisible, setIsVisible] = useState(true)
```
- Cursor is now visible from the start

#### 2. **Scroll Event Listener**
```typescript
// Added:
window.addEventListener('scroll', handleMouseEnterWindow, { passive: true })
```
- Keeps cursor visible during scroll
- Uses passive listener for better performance

#### 3. **Document Enter/Leave Handlers**
```typescript
// Added:
document.addEventListener('mouseenter', handleMouseEnterWindow)
document.addEventListener('mouseleave', handleMouseLeaveWindow)
```
- Properly handles cursor visibility when mouse enters/leaves the page
- Only hides when mouse actually leaves the browser window

#### 4. **Expanded Interactive Elements**
```typescript
// Before:
const interactiveElements = document.querySelectorAll('a, button, [role="button"]')

// After:
const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')
```
- Now detects hover on form elements too

#### 5. **Improved Z-Index**
```typescript
// Before:
className="... z-[9999] ..."

// After:
style={{ zIndex: 99999, willChange: 'transform' }}
```
- Moved z-index to inline style for better reliability
- Added `willChange: 'transform'` for smoother performance

#### 6. **Separated Animations**
```typescript
// Before:
animate={{ scale: ..., opacity: isVisible ? 1 : 0 }}

// After:
animate={{ opacity: isVisible ? 1 : 0 }}  // On parent
animate={{ scale: isHovering ? 1.5 : 1 }} // On child
```
- Separated opacity and scale animations
- Smoother transitions
- Better performance

## Testing

✅ **Cursor now stays visible when:**
- Scrolling with mouse wheel
- Scrolling with trackpad
- Using keyboard arrows to scroll
- Using Page Up/Page Down
- Using Home/End keys

✅ **Cursor properly hides when:**
- Mouse leaves the browser window

✅ **Cursor expands when hovering:**
- Links
- Buttons
- Interactive elements
- Form inputs

## Performance Improvements

1. **Passive Scroll Listener:** Doesn't block scrolling
2. **willChange Property:** Browser optimization hint
3. **Separated Animations:** Reduces render cycles
4. **Inline Z-Index:** Faster rendering

---

**Status:** ✅ Fixed and tested

The custom cursor now remains consistently visible during all types of scrolling and interaction!

