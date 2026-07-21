-- Anchos de columna proporcionales al contenido para tablas exportadas a DOCX.
-- Pandoc, al convertir pipe tables a docx, siempre reparte el ancho en partes
-- iguales sin importar el contenido (verificado: ignora el ancho del separador
-- "---"). Este filtro mide el texto real de cada columna y fija un ancho
-- proporcional, con un mínimo y un máximo para que ninguna columna colapse ni
-- una sola se coma toda la tabla.

local MIN_WIDTH = 0.12
local MAX_WIDTH = 0.45

local function cell_text_len(cell)
  local text = pandoc.utils.stringify(cell.contents)
  return utf8.len(text) or #text
end

function Table(tbl)
  local ncols = #tbl.colspecs
  local maxlen = {}
  for i = 1, ncols do maxlen[i] = 0 end

  local function scan_row(row)
    for i, cell in ipairs(row.cells) do
      local l = cell_text_len(cell)
      if l > maxlen[i] then maxlen[i] = l end
    end
  end

  for _, row in ipairs(tbl.head.rows) do scan_row(row) end
  for _, body in ipairs(tbl.bodies) do
    for _, row in ipairs(body.body) do scan_row(row) end
  end

  local total = 0
  for i = 1, ncols do
    if maxlen[i] == 0 then maxlen[i] = 1 end
    total = total + maxlen[i]
  end

  local widths = {}
  local wsum = 0
  for i = 1, ncols do
    local w = maxlen[i] / total
    if w < MIN_WIDTH then w = MIN_WIDTH end
    if w > MAX_WIDTH then w = MAX_WIDTH end
    widths[i] = w
    wsum = wsum + w
  end
  for i = 1, ncols do
    tbl.colspecs[i][2] = widths[i] / wsum
  end
  return tbl
end
