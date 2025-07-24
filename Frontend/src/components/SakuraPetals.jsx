import React, { useEffect, useState } from "react"

const SakuraPetals = () => {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    const petalArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 8
    }))
    setPetals(petalArray)
  }, [])

  return (
    <div className="sakura-container">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            background: `hsl(var(--sakura-pink))`,
            borderRadius: "50% 0 50% 0",
            animationDelay: `${petal.delay}s`,
            transform: "rotate(45deg)"
          }}
        />
      ))}
    </div>
  )
}

export default SakuraPetals
