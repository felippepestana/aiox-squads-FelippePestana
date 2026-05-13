import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import type { BodyAngle } from './AngleSelector'

interface BodySilhouetteProps {
  angle: BodyAngle
  treatmentId: string
  animating?: boolean
}

// Body transformation stages for each treatment
type TransformLevel = 'neutral' | 'sculpted' | 'slim'

const TRANSFORM_MAP: Record<string, TransformLevel> = {
  semaglutida: 'slim',
  criolipolise: 'slim',
  sculptra: 'sculpted',
  hifem: 'sculpted',
  harmonizacao: 'neutral',
  bioestimuladores: 'neutral',
  'fios-pdo': 'neutral',
  'avaliacao-cardiovascular': 'neutral',
}

// SVG paths per angle and transform level
const PATHS: Record<BodyAngle, Record<TransformLevel, string>> = {
  front: {
    neutral: 'M175,45 C195,40 210,45 215,55 C222,70 220,88 218,108 C222,130 228,148 225,170 C228,192 228,212 222,232 C218,252 213,270 208,290 C204,308 200,326 197,344 C195,358 194,372 194,385 L207,385 C207,372 208,358 210,344 C213,326 217,308 220,290 C223,270 226,252 228,232 C232,212 232,192 229,170 C226,148 230,130 226,108 C224,88 222,70 228,55 C233,42 246,38 258,40 C270,42 278,52 278,66 C278,84 272,100 268,118 C264,138 262,158 264,178 C266,198 272,216 274,236 C276,256 274,274 270,292 C266,310 262,328 256,346 C252,362 248,378 246,394 L194,394 C192,378 188,362 184,346 C178,328 174,310 170,292 C166,274 164,256 166,236 C168,216 174,198 176,178 C178,158 176,138 172,118 C168,100 162,84 162,66 C162,52 170,42 175,45 Z',
    sculpted: 'M178,45 C196,41 210,46 214,56 C220,70 218,88 216,106 C219,127 224,144 221,164 C223,185 222,204 217,222 C213,240 208,258 204,276 C200,292 198,308 196,324 C194,337 194,350 194,362 L207,362 C207,350 208,337 210,324 C212,308 214,292 218,276 C222,258 226,240 229,222 C233,204 232,185 230,164 C227,144 232,127 228,106 C226,88 224,70 230,56 C235,44 248,40 260,42 C272,44 279,54 279,67 C279,84 273,100 269,117 C266,136 264,154 266,173 C268,192 274,210 276,228 C278,247 276,264 272,281 C268,298 264,314 258,330 C254,345 250,360 248,376 L196,376 C194,360 190,345 186,330 C180,314 176,298 172,281 C168,264 166,247 168,228 C170,210 176,192 178,173 C180,154 178,136 175,117 C171,100 165,84 165,67 C165,54 172,44 178,45 Z',
    slim: 'M180,45 C196,42 208,47 212,57 C218,71 216,89 214,108 C217,128 221,145 219,164 C220,184 219,202 215,219 C211,236 207,253 204,270 C201,285 199,300 198,315 C197,327 197,339 197,350 L207,350 C207,339 208,327 209,315 C210,300 212,285 215,270 C218,253 222,236 226,219 C230,202 229,184 227,164 C225,145 229,128 226,108 C224,89 222,71 228,57 C232,45 244,42 256,44 C268,46 274,56 274,69 C274,86 269,102 266,119 C263,137 262,155 264,173 C266,191 272,208 274,225 C276,243 274,260 270,276 C266,292 262,307 257,322 C254,336 252,350 251,364 L199,364 C198,350 196,336 193,322 C188,307 184,292 180,276 C176,260 174,243 176,225 C178,208 184,191 186,173 C188,155 187,137 184,119 C181,102 176,86 176,69 C176,56 178,44 180,45 Z',
  },
  side: {
    neutral: 'M190,45 C205,40 218,46 222,58 C227,74 224,92 222,112 C224,134 230,153 230,174 C232,196 233,216 230,236 C228,256 224,274 222,292 C220,308 220,324 220,340 L232,340 C232,324 233,308 234,292 C236,274 238,256 238,236 C240,216 240,196 238,174 C238,153 242,134 240,112 C238,92 236,74 240,58 C244,44 256,40 265,44 C275,48 280,60 278,74 C276,92 270,108 268,126 C265,146 265,166 267,186 C269,206 274,224 275,242 C276,261 274,278 270,294 C266,310 262,324 258,340 L220,340',
    sculpted: 'M192,45 C206,41 218,47 221,59 C225,75 223,93 221,113 C222,134 227,152 227,172 C228,193 228,212 225,231 C222,249 219,266 217,283 C215,298 215,312 215,326 L227,326 C227,312 228,298 229,283 C231,266 234,249 236,231 C239,212 239,193 238,172 C238,152 241,134 239,113 C237,93 236,75 239,59 C242,46 253,42 263,46 C272,50 277,61 275,75 C273,92 268,108 266,125 C264,144 264,163 266,182 C268,201 273,218 274,236 C275,254 273,271 269,286 C265,301 261,315 258,330 L215,330',
    slim: 'M193,46 C206,42 217,48 220,60 C224,76 222,94 220,113 C221,133 225,151 225,170 C226,190 225,209 222,227 C219,244 216,260 215,276 C214,290 214,303 214,315 L225,315 C225,303 226,290 227,276 C228,260 231,244 234,227 C237,209 237,190 236,170 C236,151 239,133 237,113 C235,94 234,76 237,60 C240,48 250,43 259,47 C268,51 273,62 271,76 C269,93 265,109 263,126 C261,144 261,163 263,181 C265,199 270,216 271,233 C272,251 270,267 267,282 C263,296 259,310 256,324 L214,324',
  },
  back: {
    neutral: 'M175,45 C195,40 210,45 215,55 C222,70 220,88 218,108 C222,130 228,148 225,170 C228,192 228,212 222,232 C218,252 213,270 208,290 C204,308 200,326 197,344 C195,358 194,372 194,385 L207,385 C207,372 208,358 210,344 C213,326 217,308 220,290 C223,270 226,252 228,232 C232,212 232,192 229,170 C226,148 230,130 226,108 C224,88 222,70 228,55 C233,42 246,38 258,40 C270,42 278,52 278,66 C278,84 272,100 268,118 C264,138 262,158 264,178 C266,198 272,216 274,236 C276,256 274,274 270,292 C266,310 262,328 256,346 C252,362 248,378 246,394 L194,394 C192,378 188,362 184,346 C178,328 174,310 170,292 C166,274 164,256 166,236 C168,216 174,198 176,178 C178,158 176,138 172,118 C168,100 162,84 162,66 C162,52 170,42 175,45 Z M216,120 C218,135 218,150 216,165 M220,120 C222,135 222,150 220,165',
    sculpted: 'M178,45 C196,41 210,46 214,56 C220,70 218,88 216,106 C219,127 224,144 221,164 C223,185 222,204 217,222 C213,240 208,258 204,276 C200,292 198,308 196,324 C194,337 194,350 194,362 L207,362 C207,350 208,337 210,324 C212,308 214,292 218,276 C222,258 226,240 229,222 C233,204 232,185 230,164 C227,144 232,127 228,106 C226,88 224,70 230,56 C235,44 248,40 260,42 C272,44 279,54 279,67 C279,84 273,100 269,117 C266,136 264,154 266,173 C268,192 274,210 276,228 C278,247 276,264 272,281 C268,298 264,314 258,330 C254,345 250,360 248,376 L196,376 C194,360 190,345 186,330 C180,314 176,298 172,281 C168,264 166,247 168,228 C170,210 176,192 178,173 C180,154 178,136 175,117 C171,100 165,84 165,67 C165,54 172,44 178,45 Z M217,110 C219,125 219,140 217,155 M221,110 C223,125 223,140 221,155',
    slim: 'M180,45 C196,42 208,47 212,57 C218,71 216,89 214,108 C217,128 221,145 219,164 C220,184 219,202 215,219 C211,236 207,253 204,270 C201,285 199,300 198,315 C197,327 197,339 197,350 L207,350 C207,339 208,327 209,315 C210,300 212,285 215,270 C218,253 222,236 226,219 C230,202 229,184 227,164 C225,145 229,128 226,108 C224,89 222,71 228,57 C232,45 244,42 256,44 C268,46 274,56 274,69 C274,86 269,102 266,119 C263,137 262,155 264,173 C266,191 272,208 274,225 C276,243 274,260 270,276 C266,292 262,307 257,322 C254,336 252,350 251,364 L199,364 C198,350 196,336 193,322 C188,307 184,292 180,276 C176,260 174,243 176,225 C178,208 184,191 186,173 C188,155 187,137 184,119 C181,102 176,86 176,69 C176,56 178,44 180,45 Z M218,108 C220,122 220,136 218,150 M222,108 C224,122 224,136 222,150',
  },
}

export function BodySilhouette({ angle, treatmentId, animating = false }: BodySilhouetteProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const level = TRANSFORM_MAP[treatmentId] ?? 'neutral'
  const currentPath = PATHS[angle][level]
  const neutralPath = PATHS[angle]['neutral']
  const isBodyTreatment = level !== 'neutral'

  useEffect(() => {
    if (!pathRef.current || !animating) return
    let cancelled = false
    const el = pathRef.current

    const pulseOpacity = async () => {
      if (cancelled) return
      await animate(el, { opacity: [0.6, 1, 0.6] }, { duration: 2, ease: 'easeInOut', repeat: 2 })
    }
    pulseOpacity()
    return () => { cancelled = true }
  }, [animating, treatmentId])

  const isHead = angle === 'side'

  return (
    <div className="flex items-center justify-center h-full">
      <svg
        viewBox="0 0 440 480"
        className="h-full max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="silGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity={isBodyTreatment ? '0.15' : '0.08'}/>
            <stop offset="100%" stopColor="#0A1628" stopOpacity="0"/>
          </radialGradient>
          <filter id="silGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Ambient glow */}
        <ellipse
          cx="220"
          cy={angle === 'side' ? '240' : '250'}
          rx={isHead ? '60' : '100'}
          ry="170"
          fill="url(#silGrad)"
        />

        {/* Head circle */}
        <motion.circle
          cx={isHead ? '210' : '220'}
          cy="28"
          r="22"
          fill="rgba(201, 169, 110, 0.1)"
          stroke={isBodyTreatment ? 'rgba(201,169,110,0.6)' : 'rgba(201,169,110,0.3)'}
          strokeWidth="1.5"
          animate={animating ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ghost neutral outline (shown when transformed) */}
        {isBodyTreatment && (
          <path
            d={neutralPath}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}

        {/* Main body path */}
        <motion.path
          ref={pathRef}
          d={currentPath}
          fill="rgba(201, 169, 110, 0.08)"
          stroke={isBodyTreatment ? 'rgba(201,169,110,0.75)' : 'rgba(201,169,110,0.35)'}
          strokeWidth={isBodyTreatment ? '1.5' : '1'}
          filter={isBodyTreatment ? 'url(#silGlow)' : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={`${angle}-${treatmentId}`}
        />

        {/* Outer glow when transformed */}
        {isBodyTreatment && (
          <path
            d={currentPath}
            fill="none"
            stroke="rgba(201, 169, 110, 0.2)"
            strokeWidth="8"
            filter="url(#softGlow)"
          />
        )}

        {/* Spine line (back view) */}
        {angle === 'back' && (
          <line
            x1="220" y1="60"
            x2="220" y2="280"
            stroke="rgba(201,169,110,0.15)"
            strokeWidth="1"
            strokeDasharray="3,5"
          />
        )}
      </svg>
    </div>
  )
}
